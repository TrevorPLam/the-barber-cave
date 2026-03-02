import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  href?: string;
  target?: string;
  rel?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', href, target, rel, ...props }, ref) => {
    const baseClasses = 'px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variantClasses = {
      primary: 'bg-black text-white hover:bg-gray-900 focus-visible:ring-black',
      secondary: 'border-2 border-black text-black hover:bg-black hover:text-white focus-visible:ring-black',
      accent: 'bg-accent text-foreground hover:bg-amber-600 focus-visible:ring-amber-500',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${className || ''}`.trim();

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {props.children}
        </a>
      );
    }

    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
