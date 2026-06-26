interface Props {
  children: React.ReactNode;
  className?: string;
  noNavOffset?: boolean;
}

export default function PageWrapper({ children, className, noNavOffset }: Props) {
  return (
    <div className={`bg-cream ${noNavOffset ? '' : 'pt-nav-offset'} ${className ?? ''}`}>
      {children}
    </div>
  );
}
