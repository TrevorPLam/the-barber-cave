/**
 * Input component with consistent styling, error states, and full accessibility.
 *
 * Supports text, email, tel, password, textarea, and other HTML input types.
 * Includes label, helper text, and error message rendering.
 *
 * @example
 * ```tsx
 * // Standard text input
 * <Input
 *   label="Full Name"
 *   name="name"
 *   placeholder="Enter your name"
 *   required
 * />
 *
 * // With error state
 * <Input
 *   label="Email"
 *   name="email"
 *   type="email"
 *   error="Please enter a valid email address"
 * />
 *
 * // Textarea variant
 * <Input
 *   label="Message"
 *   name="message"
 *   multiline
 *   rows={4}
 * />
 * ```
 *
 * @accessibility
 * - Label is always rendered and associated via htmlFor/id
 * - Error messages linked via aria-describedby
 * - aria-invalid set when error is present
 * - Required fields marked with aria-required
 */

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface BaseInputProps {
  /** Input label text — always required for accessibility */
  label: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message — also sets aria-invalid */
  error?: string;
  /** Visual size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names for the wrapper div */
  className?: string;
}

interface TextareaInputProps extends BaseInputProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Render as a <textarea> instead of <input> */
  multiline: true;
  /** Number of visible text rows */
  rows?: number;
}

interface StandardInputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  multiline?: false;
}

type InputProps = TextareaInputProps | StandardInputProps;

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const labelSizeClasses = {
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
};

/**
 * Design-system Input component with label, error state, and forwardRef support.
 */
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input(props, ref) {
    const generatedId = useId();
    const { label, helperText, error, size = 'md', className, ...rest } = props;
    const inputId = (rest as { id?: string }).id ?? generatedId;
    const describedById = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;

    const baseInputClasses = cn(
      'w-full rounded-lg border bg-white transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      sizeClasses[size],
      error
        ? 'border-red-500 focus-visible:ring-red-500'
        : 'border-gray-300 hover:border-gray-400 focus-visible:ring-black'
    );

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label
          htmlFor={inputId}
          className={cn('font-medium text-gray-700', labelSizeClasses[size])}
        >
          {label}
          {(rest as React.InputHTMLAttributes<HTMLInputElement>).required && (
            <span className="ml-1 text-red-500" aria-hidden="true">*</span>
          )}
        </label>

        {props.multiline ? (
          <textarea
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={describedById}
            className={cn(baseInputClasses, 'resize-y')}
          />
        ) : (
          <input
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            ref={ref as React.Ref<HTMLInputElement>}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={describedById}
            className={baseInputClasses}
          />
        )}

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
