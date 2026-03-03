import { ReactNode, createContext, useContext, FormEvent } from 'react';
import { z } from 'zod';

interface FormContextValue {
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

interface FormProps<T extends z.ZodSchema> {
  schema?: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

export function Form<T extends z.ZodSchema>({
  schema,
  onSubmit,
  children,
  className = ''
}: FormProps<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      if (schema) {
        const validatedData = schema.parse(data);
        await onSubmit(validatedData);
      } else {
        await onSubmit(data as z.infer<T>);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Form submission error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContext.Provider value={{ errors, isSubmitting }}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

interface FormFieldProps {
  name: string;
  children: ReactNode;
  className?: string;
}

Form.Field = function FormField({ name, children, className = '' }: FormFieldProps) {
  const context = useContext(FormContext);
  if (!context) throw new Error('FormField must be used within Form');

  const error = context.errors[name];

  return (
    <div className={`space-y-1 ${className}`}>
      {children}
      {error && <Form.Error message={error} />}
    </div>
  );
};

interface FormLabelProps {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

Form.Label = function FormLabel({ htmlFor, children, required, className = '' }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

Form.Input = function FormInput({ className = '', ...props }: FormInputProps) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${className}`}
      {...props}
    />
  );
};

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

Form.Textarea = function FormTextarea({ className = '', ...props }: FormTextareaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-vertical ${className}`}
      {...props}
    />
  );
};

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
}

Form.Select = function FormSelect({
  options,
  placeholder,
  className = '',
  ...props
}: FormSelectProps) {
  return (
    <select
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface FormErrorProps {
  message: string;
  className?: string;
}

Form.Error = function FormError({ message, className = '' }: FormErrorProps) {
  return (
    <p className={`text-sm text-red-600 ${className}`} role="alert">
      {message}
    </p>
  );
};

interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

Form.Submit = function FormSubmit({ children, className = '', ...props }: FormSubmitProps) {
  const context = useContext(FormContext);
  if (!context) throw new Error('FormSubmit must be used within Form');

  return (
    <button
      type="submit"
      disabled={context.isSubmitting}
      className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      {...props}
    >
      {context.isSubmitting ? 'Submitting...' : children}
    </button>
  );
};
