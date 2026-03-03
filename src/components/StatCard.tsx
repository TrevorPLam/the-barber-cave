interface StatCardProps {
  value: string;
  label: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export default function StatCard({ value, label, className, ref }: StatCardProps) {
  return (
    <div
      ref={ref}
      className={`text-center ${className || ''}`.trim()}
      role="region"
      aria-labelledby={`stat-${value.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div
        id={`stat-${value.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-3xl font-bold"
        style={{
          color: 'var(--accent-bright)',
          textShadow: '0 2px 4px color(display-p3 0 0 0 / 0.3)',
        }}
        aria-label={`${value} ${label}`}
      >
        {value}
      </div>
      <div
        className="text-sm"
        style={{
          color: 'color(display-p3 0.878 0.878 0.878)',
        }}
        aria-hidden="true"
      >
        {label}
      </div>
    </div>
  );
}
