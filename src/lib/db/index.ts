// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Database connection
const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create postgres client with optimized pooling for production load
const client = postgres(connectionString, {
  max: 20, // Maximum number of connections (up from 10)
  idle_timeout: 30, // Close idle connections after 30 seconds
  connect_timeout: 10, // Connection timeout in seconds
  max_lifetime: 3600, // Max connection lifetime: 1 hour
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
})

// Create drizzle instance
export const db = drizzle(client, { schema })

/**
 * Check database connectivity with a lightweight test query.
 * Returns true when the database is reachable, false otherwise.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await client`SELECT 1`
    return true
  } catch {
    return false
  }
}

// Export types
export type Database = typeof db
