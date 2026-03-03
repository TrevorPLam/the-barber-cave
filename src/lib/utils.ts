// src/lib/utils.ts - Utility functions
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeJSONParse<T>(
  input: string,
  schema: z.ZodSchema<T>,
  fallback: T
): T {
  try {
    const raw = JSON.parse(input)
    // Object.create(null) prevents prototype chain access before validation
    const sanitized = Object.assign(Object.create(null), raw)
    return schema.parse(sanitized)
  } catch {
    return fallback
  }
}
