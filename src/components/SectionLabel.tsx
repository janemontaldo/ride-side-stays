interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className }: Props) {
  return (
    <p className={`flex items-center gap-2 text-ink-muted text-sm ${className ?? 'mb-8'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-ink-muted flex-shrink-0" />
      {children}
    </p>
  );
}
