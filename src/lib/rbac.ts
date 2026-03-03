// src/lib/rbac.ts — Role-Based Access Control definitions and helpers

export enum Role {
  CUSTOMER = 'customer',
  BARBER = 'barber',
  ADMIN = 'admin',
  OWNER = 'owner',
}

export type Resource = 'bookings' | 'services' | 'barbers' | 'admin'
export type Action = 'read' | 'create' | 'update' | 'delete' | 'read_own'

interface Permission {
  resource: Resource
  actions: Action[]
}

/**
 * Permissions granted to each role.
 *
 * CUSTOMER  — may read their own bookings and create new ones.
 * BARBER    — may read bookings (their schedule) but not mutate them.
 * ADMIN     — full access to bookings, services, and barbers.
 * OWNER     — inherits all ADMIN permissions plus admin-panel access.
 */
export const RBAC_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.CUSTOMER]: [
    { resource: 'bookings', actions: ['read_own', 'create'] },
    { resource: 'services', actions: ['read'] },
    { resource: 'barbers', actions: ['read'] },
  ],
  [Role.BARBER]: [
    { resource: 'bookings', actions: ['read'] },
    { resource: 'services', actions: ['read'] },
    { resource: 'barbers', actions: ['read'] },
  ],
  [Role.ADMIN]: [
    { resource: 'bookings', actions: ['read', 'read_own', 'create', 'update', 'delete'] },
    { resource: 'services', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'barbers', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'admin', actions: ['read'] },
  ],
  [Role.OWNER]: [
    { resource: 'bookings', actions: ['read', 'read_own', 'create', 'update', 'delete'] },
    { resource: 'services', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'barbers', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'admin', actions: ['read', 'create', 'update', 'delete'] },
  ],
}

/**
 * Check whether `role` is permitted to perform `action` on `resource`.
 *
 * @param role     The role to check (string values are coerced to the enum).
 * @param resource The target resource.
 * @param action   The intended action.
 * @returns true when the permission exists; false otherwise.
 */
export function hasPermission(
  role: string | Role | undefined | null,
  resource: Resource,
  action: Action,
): boolean {
  if (!role) return false

  // Normalise string → Role enum value
  const normalisedRole =
    typeof role === 'string' && Object.values(Role).includes(role as Role)
      ? (role as Role)
      : null

  if (!normalisedRole) return false

  const permissions = RBAC_PERMISSIONS[normalisedRole]
  if (!permissions) return false

  return permissions.some(
    p => p.resource === resource && p.actions.includes(action),
  )
}
