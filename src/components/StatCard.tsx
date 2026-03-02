import { forwardRef } from 'react';

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ value, label, className }, ref) => {
    return (
      <div ref={ref} className={`text-center ${className || ''}`.trim()}>
        <div
          className="text-3xl font-bold"
          style={{
            color: 'var(--accent-bright)',
            textShadow: '0 2px 4px color(display-p3 0 0 0 / 0.3)',
          }}
        >
          {value}
        </div>
        <div
          className="text-sm"
          style={{
            color: 'color(display-p3 0.878 0.878 0.878)',
          }}
        >
          {label}
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export default StatCard;
