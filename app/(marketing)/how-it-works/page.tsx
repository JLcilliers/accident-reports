import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How CarCrashReport.com finds traffic accidents in local news coverage, organizes them by state, and summarizes each one with links to the original reports.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    title: "We Monitor Local News",
    text: "Throughout the day, the site checks local news coverage across the United States for new traffic accidents.",
    points: [
      "Local news outlets across the U.S.",
      "Checked every 20 minutes",
      "Plane, train and boat crashes filtered out",
    ],
    icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
  },
  {
    title: "We Organize Each Incident",
    text: "Each accident gets its own page, tagged with its state and, where reported, its city. Coverage of the same crash from different outlets is grouped together.",
    points: [
      "Tagged by state and city",
      "Multiple reports grouped together",
      "Links to every source",
    ],
    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
  },
  {
    title: "You Read the Summary",
    text: "Each page gives a plain-language summary of what was reported, with the key facts up front and links to the original news coverage.",
    points: [
      "Plain-language summary",
      "Key facts up front",
      "Original coverage one click away",
    ],
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

const quickAnswers = [
  {
    question: "How quickly are new accidents added?",
    answer: "The site checks for new news coverage every 20 minutes, so incidents usually appear soon after a local outlet reports them.",
  },
  {
    question: "Is this the official police report?",
    answer: "No. Our summaries are based on news coverage and may be incomplete. Official police reports come from the law-enforcement agency that handled the crash.",
  },
  {
    question: "Do I need to sign up?",
    answer: "No. There are no accounts, forms or fees. Every page on the site is free to read.",
  },
];

export default function HowItWorksPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
          How It Works
        </h1>
        <p className="text-lg text-neutral-500 leading-relaxed max-w-3xl mx-auto mb-8">
          CarCrashReport follows local news coverage of traffic accidents and turns it into one clear
          page per incident, organized by state.
        </p>
        <Link
          href="/incidents"
          className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
        >
          See the Latest Accidents
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Three Main Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative"
          >
            <div className="absolute -top-3 left-6 bg-[#2A7D6E] text-white w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm">
              {index + 1}
            </div>
            <div className="mt-4 mb-4">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-neutral-900 mb-3">{step.title}</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">{step.text}</p>
            <ul className="space-y-2">
              {step.points.map((point) => (
                <li key={point} className="flex items-start text-sm text-neutral-600">
                  <svg className="w-4 h-4 text-[#2A7D6E] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* What This Site Is */}
      <div className="bg-[#E8F5F2] border border-[#2A7D6E]/20 rounded-2xl p-6 md:p-8 mb-16">
        <h2 className="text-2xl font-medium text-neutral-900 mb-4 text-center">
          A News Summary Site, Not an Official Record
        </h2>
        <p className="text-neutral-600 leading-relaxed text-center max-w-3xl mx-auto">
          Everything on CarCrashReport comes from published news coverage, and details can change as
          investigations continue. We are not a law firm and are not affiliated with any government
          agency. For official records, contact the law-enforcement agency that handled the crash.
        </p>
      </div>

      {/* Mini FAQ Teaser */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-8 text-center">
          Quick Answers
        </h2>
        <div className="space-y-4">
          {quickAnswers.map((item) => (
            <div
              key={item.question}
              className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <h4 className="text-neutral-900 font-medium mb-2">{item.question}</h4>
              <p className="text-neutral-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/faq" className="text-[#2A7D6E] hover:text-[#236859] font-medium inline-flex items-center transition">
            See all FAQs
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Final CTA Panel */}
      <div className="bg-neutral-900 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-medium text-white mb-4">
          Looking for a Specific Accident?
        </h2>
        <p className="text-lg text-neutral-400 mb-6 leading-relaxed">
          Search by state and city, or browse the latest incidents as they are reported.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
        >
          Search Accident Records
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </PageContainer>
  );
}
