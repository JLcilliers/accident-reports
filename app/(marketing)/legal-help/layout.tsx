import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Legal Help After an Accident - Connect With Attorneys",
  description:
    "Were you injured in an accident? Get a free case review from experienced personal injury attorneys. No obligation, no fees unless you win.",
  alternates: { canonical: "/legal-help" },
};

export default function LegalHelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
