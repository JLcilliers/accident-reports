import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get Help With Your Accident Report",
  description:
    "Have questions about finding your accident report or need legal help? Contact the CarCrashReport.com team and we'll respond during business hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
