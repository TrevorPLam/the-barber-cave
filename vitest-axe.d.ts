/// <reference types="vitest-axe" />
import 'vitest-axe';

// Ensure vitest-axe types are available globally
declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
