import type { Metadata } from "next";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "CarCrashReport.com does not collect personal information. Learn about the analytics cookies the site uses and how to opt out.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-neutral-500">Last Updated: October 2026</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">1. Introduction</h2>
          <p className="text-neutral-600 leading-relaxed">
            This Privacy Policy explains what information is collected when you visit
            CarCrashReport.com. In short: we do not ask for, collect or store personal information
            about our visitors. The only data gathered is the website analytics described below.
          </p>
          <p className="text-neutral-600 leading-relaxed mt-3">
            CarCrashReport.com is operated by Clixsy. Questions about this policy can be sent through{" "}
            <a
              href="https://www.clixsy.com/"
              className="text-[#2A7D6E] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Clixsy&apos;s website
            </a>
            .
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">2. Information We Collect</h2>
          <p className="text-neutral-600 leading-relaxed">
            We do not collect names, email addresses, phone numbers or any other personal
            information. The site has no forms, no accounts, no newsletter and no sign-ups.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">3. Analytics and Cookies</h2>
          <p className="text-neutral-600 leading-relaxed mb-3">
            We use Google Analytics and Google Tag Manager to understand how the site is used, such
            as which pages are read and how visitors find us. Google Analytics uses cookies and
            collects information such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-600">
            <li>Pages viewed and time spent on them</li>
            <li>Approximate location (city or country)</li>
            <li>Device, operating system and browser type</li>
            <li>The website or search that referred you</li>
          </ul>
          <p className="text-neutral-600 leading-relaxed mt-4">
            This information is processed by Google under{" "}
            <a
              href="https://policies.google.com/privacy"
              className="text-[#2A7D6E] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy Policy
            </a>
            . You can block these cookies in your browser settings or install the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-[#2A7D6E] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics opt-out add-on
            </a>
            .
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">4. Hosting and Security</h2>
          <p className="text-neutral-600 leading-relaxed">
            Our hosting and network providers, Vercel and Cloudflare, process technical information
            such as IP addresses and browser details in order to deliver pages and protect the site
            from abuse.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">5. People Named in News Reports</h2>
          <p className="text-neutral-600 leading-relaxed">
            Incident pages summarize information that news organizations have already published,
            which can include names, ages and locations reported in their coverage. Each summary
            links to the original reports.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">6. Selling and Sharing</h2>
          <p className="text-[#2A7D6E] font-medium">
            We do not sell or share personal information, because we do not collect any.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">7. Changes to This Privacy Policy</h2>
          <p className="text-neutral-600 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes are posted on this page with
            an updated &quot;Last Updated&quot; date.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
