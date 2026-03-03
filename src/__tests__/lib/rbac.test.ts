// src/__tests__/lib/rbac.test.ts
import { describe, it, expect } from 'vitest'
import { Role, hasPermission } from '../../lib/rbac'

describe('hasPermission', () => {
  // ── CUSTOMER ──────────────────────────────────────────────────────────────
  describe('CUSTOMER role', () => {
    it('can create bookings', () => {
      expect(hasPermission(Role.CUSTOMER, 'bookings', 'create')).toBe(true)
    })

    it('can read own bookings', () => {
      expect(hasPermission(Role.CUSTOMER, 'bookings', 'read_own')).toBe(true)
    })

    it('cannot read all bookings', () => {
      expect(hasPermission(Role.CUSTOMER, 'bookings', 'read')).toBe(false)
    })

    it('cannot delete bookings', () => {
      expect(hasPermission(Role.CUSTOMER, 'bookings', 'delete')).toBe(false)
    })

    it('can read services', () => {
      expect(hasPermission(Role.CUSTOMER, 'services', 'read')).toBe(true)
    })

    it('cannot create services', () => {
      expect(hasPermission(Role.CUSTOMER, 'services', 'create')).toBe(false)
    })

    it('cannot access admin resource', () => {
      expect(hasPermission(Role.CUSTOMER, 'admin', 'read')).toBe(false)
    })
  })

  // ── BARBER ────────────────────────────────────────────────────────────────
  describe('BARBER role', () => {
    it('can read bookings', () => {
      expect(hasPermission(Role.BARBER, 'bookings', 'read')).toBe(true)
    })

    it('cannot create bookings', () => {
      expect(hasPermission(Role.BARBER, 'bookings', 'create')).toBe(false)
    })

    it('cannot delete services', () => {
      expect(hasPermission(Role.BARBER, 'services', 'delete')).toBe(false)
    })
  })

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  describe('ADMIN role', () => {
    it('can read all bookings', () => {
      expect(hasPermission(Role.ADMIN, 'bookings', 'read')).toBe(true)
    })

    it('can delete bookings', () => {
      expect(hasPermission(Role.ADMIN, 'bookings', 'delete')).toBe(true)
    })

    it('can create services', () => {
      expect(hasPermission(Role.ADMIN, 'services', 'create')).toBe(true)
    })

    it('can read admin resource', () => {
      expect(hasPermission(Role.ADMIN, 'admin', 'read')).toBe(true)
    })

    it('cannot delete admin resource', () => {
      expect(hasPermission(Role.ADMIN, 'admin', 'delete')).toBe(false)
    })
  })

  // ── OWNER ─────────────────────────────────────────────────────────────────
  describe('OWNER role', () => {
    it('can delete admin resource', () => {
      expect(hasPermission(Role.OWNER, 'admin', 'delete')).toBe(true)
    })

    it('can do everything an admin can', () => {
      expect(hasPermission(Role.OWNER, 'bookings', 'delete')).toBe(true)
      expect(hasPermission(Role.OWNER, 'services', 'create')).toBe(true)
    })
  })

  // ── Edge cases ─────────────────────────────────────────────────────────────
  describe('edge cases', () => {
    it('returns false for null role', () => {
      expect(hasPermission(null, 'bookings', 'read')).toBe(false)
    })

    it('returns false for undefined role', () => {
      expect(hasPermission(undefined, 'bookings', 'read')).toBe(false)
    })

    it('returns false for unknown role string', () => {
      expect(hasPermission('unknown', 'bookings', 'read')).toBe(false)
    })

    it('accepts string versions of valid roles', () => {
      expect(hasPermission('admin', 'bookings', 'read')).toBe(true)
      expect(hasPermission('customer', 'bookings', 'create')).toBe(true)
    })
  })
})
