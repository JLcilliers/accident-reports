/**
 * SectionCard - A visually distinct wrapper for incident page sections
 * Provides consistent styling with subtle backgrounds, borders, and icons
 */

import { ReactNode } from "react";

type SectionVariant = "default" | "highlight" | "warning" | "info";

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  variant?: SectionVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<SectionVariant, string> = {
  default: "bg-white border-slate-200",
  highlight: "bg-[var(--primary-light)] border-[var(--primary)]/20",
  warning: "bg-amber-50 border-amber-200",
  info: "bg-blue-50 border-blue-200",
};

export function SectionCard({
  title,
  icon,
  variant = "default",
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border p-5 sm:p-6 ${variantStyles[variant]} ${className}`}
    >
      <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-semibold text-slate-900 mb-4">
        {icon && (
          <span className="flex-shrink-0 text-[var(--primary)]">{icon}</span>
        )}
        {title}
      </h2>
      {children}
    </section>
  );
}
