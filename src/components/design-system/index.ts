/**
 * Design System — centralized exports for all design-system components.
 *
 * Import from this module to access shared UI primitives:
 *
 * @example
 * ```tsx
 * import { Button, Card, Input } from '@/components/design-system'
 * ```
 */

export { default as Button } from '../Button';
export { Card } from '../Card';
export { default as Input } from './Input';
export { palette, colorPairs } from './tokens';
export type { ColorPair } from './tokens';
