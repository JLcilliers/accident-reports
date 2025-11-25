import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`bg-[#F7F7F7] min-h-screen ${className}`}>
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16 max-w-[1200px]">
        {children}
      </div>
    </div>
  );
}
