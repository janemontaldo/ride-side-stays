interface Props {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  narrow?: boolean;
}

export default function Container({ children, className, as: Tag = 'div', narrow }: Props) {
  return (
    <Tag className={`${narrow ? 'max-w-3xl' : 'max-w-7xl'} mx-auto px-5 sm:px-8 lg:px-12 ${className ?? ''}`}>
      {children}
    </Tag>
  );
}
