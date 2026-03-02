# Standardized File Header Template

## Overview
This document provides the standardized JSDoc file header template for all TypeScript and JavaScript files in the project. Consistent file headers improve code maintainability, provide context for developers, and enable better documentation generation.

## Template Structure

```typescript
/**
 * @fileoverview [Brief description of file purpose and functionality]
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * [Detailed description of file contents, responsibilities, and architectural role.
 * Include any important implementation notes, business logic, or usage context.]
 */

/**
 * @component (for React components only)
 * @description [Component purpose and functionality description]
 *
 * [Detailed component description including features, behavior, and usage context]
 *
 * @param {Object} props - Component props
 * @param {Type} props.propName - Description of prop
 *
 * @returns {JSX.Element} [Description of what component returns]
 *
 * @example
 * ```tsx
 * import ComponentName from '@/components/ComponentName';
 *
 * <ComponentName propName={value} />
 * ```
 *
 * @accessibility
 * - [Accessibility considerations and features]
 *
 * @performance
 * - [Performance optimizations and considerations]
 *
 * @dependencies
 * - [External dependencies and imports]
 *
 * @business-logic
 * - [Business rules and logic implemented]
 */
```

## Field Descriptions

### @fileoverview
- **Required**: Yes
- **Format**: Brief description (1-2 sentences)
- **Purpose**: Quick understanding of file purpose
- **Example**: `@fileoverview Hero section component for the barber shop homepage`

### @author
- **Required**: Yes
- **Format**: `Development Team`
- **Purpose**: Attribution and contact for questions

### @version
- **Required**: Yes
- **Format**: Semantic versioning (e.g., `1.0.0`)
- **Purpose**: Version tracking for documentation

### @license
- **Required**: Yes
- **Format**: `MIT`
- **Purpose**: Legal licensing information

### Detailed Description
- **Required**: Yes
- **Purpose**: Comprehensive explanation of file contents and responsibilities
- **Content**: Include architectural role, business logic, implementation notes

### Component-Specific Fields (React Components Only)
- **@component**: Marks React component files
- **@description**: Detailed component functionality
- **@param**: Props documentation with types and descriptions
- **@returns**: Return type and description
- **@example**: Usage examples
- **@accessibility**: Accessibility features and considerations
- **@performance**: Performance optimizations
- **@dependencies**: External dependencies
- **@business-logic**: Business rules implemented

## Implementation Guidelines

### When to Apply Headers
- All TypeScript (.ts, .tsx) files
- All JavaScript (.js, .jsx) files
- Utility functions and business logic files
- Data files and constants
- Configuration files

### Header Placement
- Must be the first content in the file (before imports)
- No blank lines between header and imports
- Consistent formatting across all files

### Content Standards
- Use present tense for descriptions
- Be specific and actionable
- Include business context where relevant
- Reference related components/systems
- Document performance considerations
- Note accessibility features

### Maintenance
- Update version numbers with significant changes
- Keep descriptions current with functionality changes
- Review headers during code reviews
- Update when dependencies or interfaces change

## ESLint Integration

The JSDoc quality gates (implemented in eslint.config.mjs) will enforce:
- Presence of @fileoverview tags
- Required JSDoc comments on public functions
- Proper parameter and return type documentation
- Consistent formatting and completeness

## Examples

### React Component Header
```typescript
/**
 * @fileoverview Hero section component for the barber shop homepage
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Displays the main hero section with business branding, call-to-action buttons,
 * and key statistics. Features premium visual design with P3 color gradients
 * and optimized background imagery.
 */

/**
 * @component
 * @description Main hero section component for the barber shop homepage
 * @returns {JSX.Element} The hero section with branding, CTAs, and statistics
 */
```

### Utility Function Header
```typescript
/**
 * @fileoverview Business logic utilities for appointment booking
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Provides utility functions for appointment validation, time calculations,
 * and booking workflow management.
 */

/**
 * Validates appointment booking data
 * @param {AppointmentData} data - Appointment booking information
 * @returns {ValidationResult} Validation result with errors if any
 */
export function validateAppointment(data: AppointmentData): ValidationResult {
```

### Data File Header
```typescript
/**
 * @fileoverview Static business information and configuration constants
 * @author Development Team
 * @version 1.0.0
 * @license MIT
 *
 * Centralized constants for business information, external links, and
 * configuration values used throughout the application.
 */
```

## Automated Application

The standardized header template should be applied to all existing files and enforced for all new files through:
- ESLint rules for JSDoc completeness
- Pre-commit hooks preventing commits without proper headers
- Code review checklists
- Automated linting in CI/CD pipelines

---

*This template ensures consistent, comprehensive documentation across the entire codebase.*
