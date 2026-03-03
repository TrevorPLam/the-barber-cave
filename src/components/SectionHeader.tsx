interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export default function SectionHeader({ title, description, className, ref }: SectionHeaderProps) {
  return (
    <div ref={ref} className={`text-center mb-16 ${className || ''}`.trim()}>
      <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">{title}</h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
    </div>
  );
}
