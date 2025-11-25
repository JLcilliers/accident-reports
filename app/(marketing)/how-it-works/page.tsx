import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="bg-[#05070B] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            How It Works
          </h1>
          <p className="text-lg text-[#A5B1C5] leading-relaxed max-w-3xl mx-auto mb-8">
            Getting your accident report shouldn't be confusing or expensive. Here's exactly what happens when you use AI First Accident Reports — from the moment you click "Find My Report" to the moment your summary arrives.
          </p>
          <Link
            href="/get-report/step-1"
            className="inline-flex items-center justify-center bg-[#B6FF2C] text-[#05070B] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#8EE522] transition-all shadow-lg hover:shadow-[0_0_18px_rgba(182,255,44,0.35)]"
          >
            Find My Accident Report
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>

        {/* Three Main Steps */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Step 1 */}
          <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6 relative">
            <div className="absolute -top-3 left-6 bg-[#B6FF2C] text-[#05070B] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div className="mt-4 mb-4">
              <svg className="w-10 h-10 text-[#B6FF2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Enter Your Accident Details</h3>
            <p className="text-[#A5B1C5] leading-relaxed mb-4">
              Start by telling us where and when the accident happened. You can use your current location or type in the city, state, and date. We'll also ask a few quick questions about injuries so we know how to handle your request.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Location and date of the accident
              </li>
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic accident type (car, truck, etc.)
              </li>
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Injury status: injured, not sure, or not injured
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6 relative">
            <div className="absolute -top-3 left-6 bg-[#B6FF2C] text-[#05070B] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div className="mt-4 mb-4">
              <svg className="w-10 h-10 text-[#B6FF2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">We Search, Match, and Verify</h3>
            <p className="text-[#A5B1C5] leading-relaxed mb-4">
              Our system searches public records and partner data to find incidents that match your details. We automatically rank the closest matches and, if needed, queue your request for manual review by our team.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                AI-powered matching with fuzzy search
              </li>
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Top potential incidents returned in seconds
              </li>
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Human lookup if we can't find a clear match
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6 relative">
            <div className="absolute -top-3 left-6 bg-[#B6FF2C] text-[#05070B] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div className="mt-4 mb-4">
              <svg className="w-10 h-10 text-[#B6FF2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">You Get Your Summary & Next Steps</h3>
            <p className="text-[#A5B1C5] leading-relaxed mb-4">
              Once we've identified the right incident, we generate a clear summary and check if you're eligible for legal follow-up. You'll see your accident summary, options to request the full official report, and how to speak with a legal professional if you choose.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Plain-language accident summary
              </li>
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Options to get your full report
              </li>
              <li className="flex items-start text-sm text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                If qualified, a legal team may contact you
              </li>
            </ul>
          </div>
        </section>

        {/* What Happens Behind the Scenes */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            What Happens Behind the Scenes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* On Your Screen */}
            <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#B6FF2C] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                On Your Screen
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-[#A5B1C5] border-b border-[#1C2430] pb-4">
                  <span className="text-[#B6FF2C] font-bold mr-3">1.</span>
                  You step through a simple form asking for accident details and injury status.
                </li>
                <li className="flex items-start text-[#A5B1C5] border-b border-[#1C2430] pb-4">
                  <span className="text-[#B6FF2C] font-bold mr-3">2.</span>
                  You confirm your phone number with a quick text verification.
                </li>
                <li className="flex items-start text-[#A5B1C5] border-b border-[#1C2430] pb-4">
                  <span className="text-[#B6FF2C] font-bold mr-3">3.</span>
                  You see a list of possible incidents or a message that we're reviewing your request.
                </li>
                <li className="flex items-start text-[#A5B1C5]">
                  <span className="text-[#B6FF2C] font-bold mr-3">4.</span>
                  You receive a basic summary and, where available, options to get the full report.
                </li>
              </ul>
            </div>

            {/* Behind the Scenes */}
            <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#B6FF2C] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Behind the Scenes
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start text-[#A5B1C5] border-b border-[#1C2430] pb-4">
                  <span className="text-[#B6FF2C] font-bold mr-3">1.</span>
                  We capture your location (automatic if possible, or from what you type) and route your request to the correct police jurisdiction.
                </li>
                <li className="flex items-start text-[#A5B1C5] border-b border-[#1C2430] pb-4">
                  <span className="text-[#B6FF2C] font-bold mr-3">2.</span>
                  Our matching engine compares your details against recent incidents and ranks the most likely matches.
                </li>
                <li className="flex items-start text-[#A5B1C5] border-b border-[#1C2430] pb-4">
                  <span className="text-[#B6FF2C] font-bold mr-3">3.</span>
                  If we can't confidently match your accident, we queue it for a human lookup and estimate how long it may take.
                </li>
                <li className="flex items-start text-[#A5B1C5] border-b border-[#1C2430] pb-4">
                  <span className="text-[#B6FF2C] font-bold mr-3">4.</span>
                  We run checks like injury status, existing legal representation, and geography to see if you qualify for a legal follow-up.
                </li>
                <li className="flex items-start text-[#A5B1C5]">
                  <span className="text-[#B6FF2C] font-bold mr-3">5.</span>
                  If you qualify, your information is securely packaged and sent to a partner legal team's CRM for outreach.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* What We Need / What We Do */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* What We Need From You */}
          <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#B6FF2C]/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-[#B6FF2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">What We Need From You</h3>
            </div>
            <p className="text-[#A5B1C5] mb-4">We keep your part simple — just a few key details.</p>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Where and when the accident happened
              </li>
              <li className="flex items-start text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Whether anyone was injured or you're not sure
              </li>
              <li className="flex items-start text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                A phone number we can verify with a one-time code
              </li>
              <li className="flex items-start text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Optional email address for updates and your report link
              </li>
            </ul>
            <p className="text-sm text-[#A5B1C5]/70 italic border-t border-[#1C2430] pt-4">
              You can stop at any time — you're not committing to hire a lawyer just by using this service.
            </p>
          </div>

          {/* What We Do For You */}
          <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#B6FF2C]/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-[#B6FF2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">What We Do For You</h3>
            </div>
            <p className="text-[#A5B1C5] mb-4">Once we have your details, we handle the heavy lifting.</p>
            <ul className="space-y-3">
              <li className="flex items-start text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Search accident data automatically and run fuzzy matching
              </li>
              <li className="flex items-start text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Queue a human lookup if the system can't find a clear match
              </li>
              <li className="flex items-start text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Generate a readable summary of what we find
              </li>
              <li className="flex items-start text-[#A5B1C5]">
                <svg className="w-4 h-4 text-[#B6FF2C] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                If you qualify, connect you with legal professionals who can help
              </li>
            </ul>
          </div>
        </section>

        {/* Trust & Reassurance Strip */}
        <section className="bg-[#0C1016] rounded-2xl p-6 md:p-8 mb-16 border border-[#1C2430]">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Safe, Transparent, and No Surprise Fees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Data Privacy */}
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-[#B6FF2C]/20 rounded-lg flex items-center justify-center mx-auto md:mx-0 mb-4">
                <svg className="w-6 h-6 text-[#B6FF2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Your info stays encrypted</h4>
              <p className="text-[#A5B1C5] text-sm leading-relaxed">
                We only use your details to look up your accident and connect you with legal options if you choose. We don't sell your contact information.
              </p>
            </div>

            {/* No Obligation */}
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-[#B6FF2C]/20 rounded-lg flex items-center justify-center mx-auto md:mx-0 mb-4">
                <svg className="w-6 h-6 text-[#B6FF2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">You're always in control</h4>
              <p className="text-[#A5B1C5] text-sm leading-relaxed">
                Using this tool doesn't create an attorney-client relationship. You decide if and when to speak with a lawyer.
              </p>
            </div>

            {/* Cost Transparency */}
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-[#B6FF2C]/20 rounded-lg flex items-center justify-center mx-auto md:mx-0 mb-4">
                <svg className="w-6 h-6 text-[#B6FF2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-white font-bold mb-2">Basic summary is free</h4>
              <p className="text-[#A5B1C5] text-sm leading-relaxed">
                Your basic accident summary is free. If a paid official report is required, we'll show the cost clearly before you decide.
              </p>
            </div>
          </div>
        </section>

        {/* Mini FAQ Teaser */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Quick Answers
          </h2>
          <div className="space-y-4">
            <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6">
              <h4 className="text-white font-bold mb-2">How long does it take to get my summary?</h4>
              <p className="text-[#A5B1C5] leading-relaxed">
                Most people see potential matches within a few minutes. If we need to do a manual lookup, we'll show an estimated time and update you by text or email.
              </p>
            </div>
            <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6">
              <h4 className="text-white font-bold mb-2">Is this the official police report?</h4>
              <p className="text-[#A5B1C5] leading-relaxed">
                We start by giving you an easy-to-understand summary. In many areas, we can also guide you to obtain the official report or help you request it.
              </p>
            </div>
            <div className="bg-[#0C1016] border border-[#1C2430] rounded-xl p-6">
              <h4 className="text-white font-bold mb-2">Will a lawyer contact me?</h4>
              <p className="text-[#A5B1C5] leading-relaxed">
                If you appear to qualify and you give us permission, a partner legal team may reach out to explain your options. You're always free to say no.
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/faq" className="text-[#B6FF2C] hover:text-[#8EE522] font-semibold inline-flex items-center transition">
              See all FAQs
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Final CTA Panel */}
        <section className="bg-[#0C1016] rounded-2xl p-8 text-center border border-[#1C2430]">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Accident Report?
          </h2>
          <p className="text-lg text-[#A5B1C5] mb-6 leading-relaxed">
            It usually takes less than 2 minutes to start your free accident summary.
          </p>
          <Link
            href="/get-report/step-1"
            className="inline-flex items-center justify-center bg-[#B6FF2C] text-[#05070B] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#8EE522] transition-all shadow-lg hover:shadow-[0_0_18px_rgba(182,255,44,0.35)] mb-4"
          >
            Start My Free Search
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div>
            <Link href="/contact" className="text-[#A5B1C5] hover:text-[#B6FF2C] text-sm transition">
              Prefer to talk to a person? Contact our team →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
