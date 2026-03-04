/**
 * Migration Manager for The Barber Cave.
 *
 * Provides a programmatic interface for listing, applying, and rolling back
 * Drizzle ORM migrations. All migration files are located in the `./drizzle`
 * directory and are tracked in the `schema_migrations` table inside the
 * database.
 *
 * Usage:
 * ```ts
 * import { MigrationManager } from '@/lib/migrations';
 *
 * const manager = new MigrationManager();
 *
 * // Show current status
 * const status = await manager.status();
 *
 * // Apply all pending migrations
 * await manager.migrate();
 *
 * // Roll back the most recently applied migration
 * await manager.rollback();
 * ```
 *
 * Note: `migrate()` delegates to `drizzle-orm/migrator` which applies all
 * pending Drizzle-generated SQL files atomically.  `rollback()` is a
 * best-effort operation that marks the last applied migration as rolled-back
 * in the tracking table; actual schema reversal requires a corresponding
 * down-migration SQL file.
 */

import path from 'path';
import fs from 'fs';
import { sql } from 'drizzle-orm';
import { migrate as drizzleMigrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '@/lib/db';

// Path to the directory containing Drizzle-generated migration files
const MIGRATIONS_FOLDER = path.join(process.cwd(), 'drizzle');

/** Allowed characters for migration tags (alphanumeric + underscores + hyphens). */
const SAFE_TAG_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Validates a migration tag to ensure it contains only safe characters.
 * Migration tags originate from filenames in ./drizzle — this guards against
 * unexpected values reaching the SQL layer.
 *
 * @throws {Error} when the tag contains characters outside [a-zA-Z0-9_-]
 */
function validateTag(tag: string): void {
  if (!SAFE_TAG_PATTERN.test(tag)) {
    throw new Error(`Invalid migration tag: "${tag}". Tags must match /^[a-zA-Z0-9_-]+$/.`);
  }
}

/** A single migration entry as stored in the tracking table. */
export interface MigrationRecord {
  /** Drizzle migration tag, e.g. "0000_tidy_dark_beast" */
  tag: string;
  /** ISO-8601 timestamp when the migration was applied */
  appliedAt: string;
  /** Whether this migration has been rolled back */
  rolledBack: boolean;
}

/** Status report for a single migration file. */
export interface MigrationStatus {
  tag: string;
  /** true when the migration has been applied to the database */
  applied: boolean;
  /** true when the migration was previously applied but then rolled back */
  rolledBack: boolean;
  /** ISO-8601 timestamp, present only when applied */
  appliedAt?: string;
}

/**
 * Manages Drizzle ORM schema migrations with version tracking and rollback
 * support via a lightweight `schema_migrations` table.
 */
export class MigrationManager {
  /**
   * Ensures the `schema_migrations` tracking table exists.
   * Idempotent — safe to call before every operation.
   */
  private async ensureTrackingTable(): Promise<void> {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        tag        TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        rolled_back BOOLEAN NOT NULL DEFAULT FALSE
      )
    `);
  }

  /**
   * Reads applied migrations from the tracking table.
   */
  private async appliedMigrations(): Promise<MigrationRecord[]> {
    await this.ensureTrackingTable();
    const rows = await db.execute<{
      tag: string;
      applied_at: string;
      rolled_back: boolean;
    }>(sql`SELECT tag, applied_at, rolled_back FROM schema_migrations ORDER BY applied_at ASC`);
    return rows.map((r) => ({
      tag: r.tag,
      appliedAt: r.applied_at,
      rolledBack: r.rolled_back,
    }));
  }

  /**
   * Returns the sorted list of migration tags found in the migrations folder.
   */
  availableMigrations(): string[] {
    if (!fs.existsSync(MIGRATIONS_FOLDER)) {
      return [];
    }
    return fs
      .readdirSync(MIGRATIONS_FOLDER)
      .filter((f) => f.endsWith('.sql'))
      .map((f) => f.replace(/\.sql$/, ''))
      .sort();
  }

  /**
   * Returns a combined status report comparing migration files against the
   * tracking table.
   */
  async status(): Promise<MigrationStatus[]> {
    const available = this.availableMigrations();
    const applied = await this.appliedMigrations();
    const appliedMap = new Map(applied.map((r) => [r.tag, r]));

    return available.map((tag) => {
      const record = appliedMap.get(tag);
      return {
        tag,
        applied: !!record && !record.rolledBack,
        rolledBack: !!record && record.rolledBack,
        appliedAt: record?.appliedAt,
      };
    });
  }

  /**
   * Applies all pending Drizzle migrations and records them in the tracking
   * table.
   *
   * Delegates to `drizzle-orm/migrator` for the actual SQL execution so that
   * Drizzle's own idempotency guarantees are respected.
   */
  async migrate(): Promise<void> {
    await this.ensureTrackingTable();

    // Let Drizzle apply any pending migrations
    await drizzleMigrate(db, { migrationsFolder: MIGRATIONS_FOLDER });

    // Sync the tracking table with the migrations that are now applied
    const available = this.availableMigrations();
    const applied = await this.appliedMigrations();
    const appliedTags = new Set(applied.filter((r) => !r.rolledBack).map((r) => r.tag));

    for (const tag of available) {
      if (!appliedTags.has(tag)) {
        validateTag(tag);
        await db.execute(
          sql`INSERT INTO schema_migrations (tag) VALUES (${tag})
              ON CONFLICT (tag) DO UPDATE SET rolled_back = FALSE, applied_at = NOW()`
        );
      }
    }
  }

  /**
   * Marks the most recently applied migration as rolled back in the tracking
   * table.
   *
   * **Important:** This method only updates the tracking table. To actually
   * revert database schema changes you must provide a corresponding
   * down-migration SQL file and apply it manually, or use `drizzle-kit drop`.
   *
   * @returns The tag of the migration that was marked as rolled back, or
   *          `null` if there are no applied migrations to roll back.
   */
  async rollback(): Promise<string | null> {
    await this.ensureTrackingTable();
    const applied = await this.appliedMigrations();
    const active = applied.filter((r) => !r.rolledBack);

    if (active.length === 0) {
      return null;
    }

    const last = active[active.length - 1];
    validateTag(last.tag);
    await db.execute(
      sql`UPDATE schema_migrations SET rolled_back = TRUE WHERE tag = ${last.tag}`
    );
    return last.tag;
  }
}

/** Singleton instance for use in scripts and API routes. */
export const migrationManager = new MigrationManager();
