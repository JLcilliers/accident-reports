import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "CarCrashReport.com follows local news coverage of traffic accidents across the United States and summarizes each incident, with links to the original reports.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">About CarCrashReport</h1>
        <p className="text-lg text-neutral-500 leading-relaxed">
          Up-to-date news on traffic accidents across the United States, in one place.
        </p>
      </div>

      <div className="space-y-6">
        {/* What We Do */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">What We Do</h2>
          <p className="text-neutral-600 mb-4 leading-relaxed">
            CarCrashReport follows local news coverage of traffic accidents across the United States.
            Each incident gets its own page with a plain-language summary, the key facts, and links
            to the news reports it is based on.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Incidents are organized by state, so you can quickly see what has been reported near
            you. New incidents are added automatically throughout the day.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E8F5F2] rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-medium text-[#2A7D6E]">1</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">We Monitor the News</h3>
              <p className="text-sm text-neutral-500">
                New accident coverage from local outlets is picked up automatically
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E8F5F2] rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-medium text-[#2A7D6E]">2</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">We Summarize</h3>
              <p className="text-sm text-neutral-500">
                Each incident is summarized in plain language with the key facts up front
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E8F5F2] rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-medium text-[#2A7D6E]">3</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">You Browse</h3>
              <p className="text-sm text-neutral-500">
                Find incidents by state, or search by location
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">Our Values</h2>
          <div className="space-y-5">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Transparency</h3>
                <p className="text-neutral-600">
                  Every summary links to the original coverage, so you can check the details yourself.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Privacy</h3>
                <p className="text-neutral-600">
                  There are no forms or accounts. We don&apos;t ask for or store personal information.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Timeliness</h3>
                <p className="text-neutral-600">
                  New incidents appear automatically as local news outlets report them.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Respect</h3>
                <p className="text-neutral-600">
                  Real people are affected by every crash. We cover each one with care.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-neutral-900 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-medium text-white mb-4">Find Recent Accidents</h2>
          <p className="text-lg text-neutral-400 mb-6 leading-relaxed">
            Browse the latest incidents or search by location
          </p>
          <Link
            href="/search"
            className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
          >
            Search Accident Records
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
