import { forwardRef } from 'react';
import { ChevronRight } from 'lucide-react';

interface LinkWithIconProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'accent';
  className?: string;
  target?: string;
  rel?: string;
}

const LinkWithIcon = forwardRef<HTMLAnchorElement, LinkWithIconProps>(
  ({ href, children, icon: Icon = ChevronRight, variant = 'default', className, target, rel }, ref) => {
    const baseClasses = 'inline-flex items-center font-semibold transition-colors';

    const variantClasses = {
      default: 'text-black hover:text-amber-500',
      accent: 'text-amber-500 hover:text-black',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${className || ''}`.trim();

    return (
      <a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        className={classes}
      >
        {children}
        <Icon className="h-5 w-5 ml-2" />
      </a>
    );
  }
);

LinkWithIcon.displayName = 'LinkWithIcon';

export default LinkWithIcon;
