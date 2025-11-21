import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`container mx-auto px-4 py-8 max-w-6xl ${className}`}>
      {children}
    </div>
  );
}
