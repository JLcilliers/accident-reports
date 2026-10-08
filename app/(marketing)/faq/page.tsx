import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about CarCrashReport.com: where the accident information comes from, how often it is updated, and what the site covers.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Is this site free?",
      answer: "Yes. There is nothing to pay, no account to create and no forms to fill in.",
    },
    {
      question: "Where does the information come from?",
      answer: "We compile accident information from publicly available news sources, including local news outlets and press releases. Our system organizes this information by location and date so you can find relevant accidents in your area.",
    },
    {
      question: "How quickly are new accidents added?",
      answer: "The site checks local news coverage every 20 minutes, so incidents usually appear soon after a news outlet reports them.",
    },
    {
      question: "Is this an official accident report?",
      answer: "No. Our summaries are based on news coverage and may be incomplete or change as investigations continue. Official police reports come from the law-enforcement agency that handled the crash.",
    },
    {
      question: "What if an accident isn't listed?",
      answer: "Our database only includes accidents covered by news sources. If an accident isn't listed, contact the local police department or sheriff's office that responded to it for the official report.",
    },
    {
      question: "What states do you cover?",
      answer: "Incidents come from news coverage across the United States. Visit our Accidents page to see which states currently have reports.",
    },
    {
      question: "Do you collect personal information?",
      answer: "No. The site has no forms or accounts. We use Google Analytics cookies to understand how the site is used; our Privacy Policy explains how to opt out.",
    },
    {
      question: "Are you a law firm?",
      answer: "No. We are not a law firm, we don't give legal advice, and we are not affiliated with any government agency.",
    },
  ];

  // FAQPage JSON-LD for rich snippets in Google Search
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <PageContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-neutral-500 leading-relaxed">
          Answers to common questions about CarCrashReport
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            <h2 className="text-lg font-medium text-neutral-900 mb-3">{faq.question}</h2>
            <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-neutral-900 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-medium text-white mb-4">Looking for an Accident?</h2>
        <p className="text-lg text-neutral-400 mb-6 leading-relaxed">
          Search recent incidents by location, or browse the latest reports
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
          >
            Search Accident Records
          </Link>
          <Link
            href="/incidents"
            className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all border border-neutral-700"
          >
            Latest Accidents
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
