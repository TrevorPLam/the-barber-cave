import { forwardRef } from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, description, className }, ref) => {
    return (
      <div ref={ref} className={`text-center mb-16 ${className || ''}`.trim()}>
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">{title}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
