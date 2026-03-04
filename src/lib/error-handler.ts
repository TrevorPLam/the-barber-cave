// src/lib/error-handler.ts — Centralised API error types and response helper

import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Base application error.
 * Thrown inside API route handlers; caught by `handleAPIError`.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message)
    this.name = 'AppError'
    // Maintains proper prototype chain in transpiled code
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

// ─── Convenience sub-classes ────────────────────────────────────────────────

export class ValidationError extends AppError {
  constructor(message = 'Invalid request data') {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN')
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT')
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

// ─── Response helper ────────────────────────────────────────────────────────

interface ErrorResponse {
  error: string
  code: string
  details?: unknown
}

/**
 * Convert any thrown value into a consistent JSON error response.
 *
 * - AppError sub-classes → status / code from the instance
 * - ZodError              → 400 VALIDATION_ERROR with field-level details
 * - Everything else       → 500 INTERNAL_SERVER_ERROR (message hidden in prod)
 */
export function handleAPIError(error: unknown): NextResponse<ErrorResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode },
    )
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        details: error.issues,
      },
      { status: 400 },
    )
  }

  // Hide internal details in production
  const message =
    process.env.NODE_ENV !== 'production' && error instanceof Error
      ? error.message
      : 'Internal server error'

  return NextResponse.json(
    { error: message, code: 'INTERNAL_SERVER_ERROR' },
    { status: 500 },
  )
}
