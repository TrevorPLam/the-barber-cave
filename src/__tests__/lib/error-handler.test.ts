// src/__tests__/lib/error-handler.test.ts
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  handleAPIError,
} from '../../lib/error-handler'

describe('AppError sub-classes', () => {
  it('ValidationError has correct status and code', () => {
    const err = new ValidationError('bad input')
    expect(err.statusCode).toBe(400)
    expect(err.code).toBe('VALIDATION_ERROR')
    expect(err.message).toBe('bad input')
    expect(err instanceof AppError).toBe(true)
    expect(err instanceof Error).toBe(true)
  })

  it('NotFoundError has correct status and code', () => {
    const err = new NotFoundError('Service')
    expect(err.statusCode).toBe(404)
    expect(err.code).toBe('NOT_FOUND')
    expect(err.message).toBe('Service not found')
  })

  it('UnauthorizedError has correct status and code', () => {
    const err = new UnauthorizedError()
    expect(err.statusCode).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
  })

  it('ForbiddenError has correct status and code', () => {
    const err = new ForbiddenError()
    expect(err.statusCode).toBe(403)
    expect(err.code).toBe('FORBIDDEN')
  })

  it('ConflictError has correct status and code', () => {
    const err = new ConflictError('already exists')
    expect(err.statusCode).toBe(409)
    expect(err.code).toBe('CONFLICT')
  })
})

describe('handleAPIError', () => {
  it('returns correct JSON for AppError', async () => {
    const err = new ForbiddenError('nope')
    const res = handleAPIError(err)
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('nope')
    expect(body.code).toBe('FORBIDDEN')
  })

  it('returns 400 with details for ZodError', async () => {
    const schema = z.object({ name: z.string() })
    let zodError: z.ZodError | null = null
    try {
      schema.parse({ name: 123 })
    } catch (e) {
      zodError = e as z.ZodError
    }

    const res = handleAPIError(zodError!)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.code).toBe('VALIDATION_ERROR')
    // Zod v4 uses .issues; details should be a non-empty array
    expect(Array.isArray(body.details)).toBe(true)
    expect(body.details.length).toBeGreaterThan(0)
  })

  it('returns 500 for unknown errors', async () => {
    const res = handleAPIError(new Error('something unexpected'))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.code).toBe('INTERNAL_SERVER_ERROR')
  })

  it('returns 500 for non-Error throws', async () => {
    const res = handleAPIError('string error')
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.code).toBe('INTERNAL_SERVER_ERROR')
  })
})
