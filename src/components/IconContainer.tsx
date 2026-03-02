import { forwardRef } from 'react';

interface IconContainerProps {
  children: React.ReactNode;
  bg?: 'black' | 'amber' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const IconContainer = forwardRef<HTMLDivElement, IconContainerProps>(
  ({ children, bg = 'black', size = 'md', className }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    };

    const bgClasses = {
      black: 'bg-black',
      amber: 'bg-amber-500',
      white: 'bg-white border-2 border-gray-200',
    };

    const textClasses = {
      black: 'text-white',
      amber: 'text-black',
      white: 'text-black',
    };

    const classes = `icon-container ${sizeClasses[size]} rounded-full flex items-center justify-center ${bgClasses[bg]} ${textClasses[bg]} ${className || ''}`.trim();

    return (
      <div ref={ref} className={classes}>
        {children}
      </div>
    );
  }
);

IconContainer.displayName = 'IconContainer';

export default IconContainer;
