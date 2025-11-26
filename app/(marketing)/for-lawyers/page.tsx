import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function ForLawyersPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">Partner With Us</h1>
        <p className="text-lg text-neutral-500 leading-relaxed">
          Generate high-quality personal injury leads from accident victims actively seeking legal help
        </p>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">Why Partner With AccidentLookup?</h2>
          <p className="text-neutral-600 mb-4 leading-relaxed">
            We connect personal injury law firms with accident victims at the exact moment they
            need legal assistance - right after they've obtained their accident report and
            confirmed the details of their case.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Our platform generates exclusive, high-intent leads from people who have been injured
            in accidents and are actively looking for legal representation.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">Benefits of Partnership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">High-Quality Leads</h3>
                <p className="text-neutral-600 text-sm">
                  Accident victims who have already documented their case and are ready to pursue legal action
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Verified Information</h3>
                <p className="text-neutral-600 text-sm">
                  Leads come with accident report details, injury information, and contact preferences
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Nationwide Coverage</h3>
                <p className="text-neutral-600 text-sm">
                  We generate leads from multiple states and are actively expanding coverage
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#E8F5F2] rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Performance-Based</h3>
                <p className="text-neutral-600 text-sm">
                  Flexible partnership models designed to maximize your ROI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[#2A7D6E] text-white rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-medium">
                1
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Accident Victims Find Their Reports</h3>
                <p className="text-neutral-600">
                  People use our platform to obtain free accident reports, often discovering the
                  extent of their case for the first time.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[#2A7D6E] text-white rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-medium">
                2
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">We Identify Legal Opportunities</h3>
                <p className="text-neutral-600">
                  Users who indicate injuries or damages are offered free legal consultations
                  with experienced attorneys.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[#2A7D6E] text-white rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-medium">
                3
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Qualified Leads Are Delivered</h3>
                <p className="text-neutral-600">
                  Partner firms receive detailed lead information including accident details,
                  injuries, and contact information - all in real-time.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[#2A7D6E] text-white rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-medium">
                4
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">You Convert and Win Cases</h3>
                <p className="text-neutral-600">
                  Your firm contacts the client, provides consultation, and converts them into
                  paying cases.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Quality */}
        <div className="bg-[#E8F5F2] border border-[#2A7D6E]/20 rounded-2xl p-8">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">What Makes Our Leads Different</h2>
          <ul className="space-y-3 text-neutral-700">
            <li className="flex items-start">
              <span className="text-[#2A7D6E] mr-3 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </span>
              <span>
                <strong className="text-neutral-900">Pre-Qualified:</strong> All leads have confirmed injuries or significant damages
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#2A7D6E] mr-3 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </span>
              <span>
                <strong className="text-neutral-900">Documented:</strong> Accident reports already obtained, providing case details
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#2A7D6E] mr-3 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </span>
              <span>
                <strong className="text-neutral-900">Motivated:</strong> Actively seeking legal representation, not just browsing
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#2A7D6E] mr-3 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </span>
              <span>
                <strong className="text-neutral-900">Exclusive:</strong> Options for exclusive leads in your practice area
              </span>
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="bg-neutral-900 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-medium text-white mb-4">Interested in Partnering?</h2>
          <p className="text-lg text-neutral-400 mb-6 leading-relaxed">
            Contact us to learn more about our partnership opportunities and lead generation programs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:partners@accidentlookup.com"
              className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
            >
              Contact Us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all border border-neutral-700"
            >
              Send a Message
            </Link>
          </div>
          <p className="mt-6 text-neutral-400">
            Email: partners@accidentlookup.com
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
