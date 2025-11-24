import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO SECTION - Asymmetric layout with solid overlay */}
      <section className="relative text-white overflow-hidden min-h-[680px] lg:min-h-[760px] flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            src="https://streamable.com/e/q21jnj?autoplay=1&nocontrols=1&muted=1&loop=1"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute border-none"
            style={{
              width: '177.77vh',
              height: '56.25vw',
              minWidth: '100%',
              minHeight: '100%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
          {/* Solid dark overlay instead of gradient */}
          <div className="absolute inset-0 bg-black/65 z-10"></div>
        </div>

        {/* Content - Slightly offset to left on desktop */}
        <div className="container mx-auto px-6 lg:px-16 relative z-20 py-16 lg:py-28">
          <div className="max-w-3xl lg:ml-0 text-center lg:text-left">
            {/* Trust Badges - Left aligned on desktop */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-7">
              <div className="flex items-center gap-2 text-sm bg-white/15 px-4 py-2 rounded-md border border-white/10">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">10,000+ Reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/15 px-4 py-2 rounded-md border border-white/10">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Secure</span>
              </div>
            </div>

            {/* Headline - Smaller, more professional size */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Get Your Accident Report Online – Free
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg mb-8 text-gray-100 leading-relaxed max-w-2xl">
              We locate and deliver your accident or police report at no cost.
              Plus, get a free case review from experienced personal injury attorneys.
            </p>

            {/* CTAs - Varied button sizes */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-center lg:justify-start">
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-7 py-3.5 rounded-md font-bold text-base hover:bg-blue-700 transition shadow-lg"
              >
                Find My Accident Report
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <Link
                href="/legal-help"
                className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3.5 rounded-md font-semibold text-base hover:bg-gray-100 transition border border-white shadow-md"
              >
                Get Free Case Review
              </Link>
            </div>

            {/* Trust Microcopy */}
            <p className="text-sm text-gray-200 flex items-center justify-center lg:justify-start gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              No credit card required • 100% confidential • Takes under 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - Staggered cards with varied spacing */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-left mb-14 border-l-4 border-blue-600 pl-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-base text-gray-600">Simple, fast, and completely free</p>
          </div>

          {/* Staggered card layout with different heights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 - Elevated slightly */}
            <div className="bg-white rounded-lg p-7 shadow-md border border-gray-200 md:-mt-4">
              <div className="flex items-start gap-3 mb-5">
                <div className="bg-blue-600 rounded-md w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tell Us About Your Accident</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Provide basic details about when and where your accident occurred.
                Takes less than 2 minutes.
              </p>
            </div>

            {/* Step 2 - Normal position */}
            <div className="bg-gray-50 rounded-lg p-7 shadow border border-gray-200">
              <div className="flex items-start gap-3 mb-5">
                <div className="bg-blue-600 rounded-md w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">We Locate Your Report</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Our system searches official databases to find your accident or police report.
              </p>
            </div>

            {/* Step 3 - Elevated slightly, different shadow */}
            <div className="bg-white rounded-lg p-7 shadow-lg border border-gray-200 md:-mt-4">
              <div className="flex items-start gap-3 mb-5">
                <div className="bg-blue-600 rounded-md w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Get Your Report + Legal Help</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Download your report for free and get a no-obligation case review
                from experienced attorneys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / STATS SECTION - Solid background with subtle pattern */}
      <section className="py-16 lg:py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Trusted by Accident Victims Nationwide
            </h2>
          </div>

          {/* Varied card styles with different shadows and borders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 - Border emphasis */}
            <div className="bg-white rounded-lg p-7 text-center border-2 border-blue-200 shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-lg mb-4 border border-blue-100">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <p className="text-gray-600 font-medium text-sm">Reports Delivered</p>
            </div>

            {/* Stat 2 - Stronger shadow */}
            <div className="bg-white rounded-lg p-7 text-center shadow-lg border border-gray-100">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-lg mb-4 border border-green-100">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-600 font-medium text-sm">Support Available</p>
            </div>

            {/* Stat 3 - Light shadow */}
            <div className="bg-white rounded-lg p-7 text-center shadow border border-gray-200">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-lg mb-4 border border-blue-100">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600 font-medium text-sm">Free Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION - Asymmetric layout, no gradients */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="mb-14 border-l-4 border-blue-600 pl-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Choose Us?</h2>
            <p className="text-base text-gray-600">Everything you need to get your accident report and legal support</p>
          </div>

          {/* Varied card layout with different positioning and styles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7 max-w-5xl">
            {/* Benefit 1 - Solid background with border */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600 shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 bg-blue-600 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Completely Free</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    No hidden fees, no credit card required. Get your accident report at absolutely no cost.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 2 - White background with shadow */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 md:mt-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 bg-green-600 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Fast & Easy</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Simple online process that takes minutes. No need to visit government offices.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 3 - Light background */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow md:-mt-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 bg-blue-600 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Confidential</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Your information is protected with industry-standard encryption and security.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 4 - Solid background with accent border */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-green-600 shadow-md md:mt-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 bg-green-600 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Legal Support Available</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Connect with experienced attorneys for a free case review if you were injured.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER SECTION - Solid background, no gradient */}
      <section className="py-18 lg:py-22 bg-blue-600 border-t-4 border-blue-700">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Ready to Get Your Accident Report?
              </h2>
              <p className="text-base text-blue-100 leading-relaxed">
                Start now and get your free report in minutes
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-md font-bold text-base hover:bg-gray-50 transition shadow-lg whitespace-nowrap"
              >
                Get Started Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>
          </div>
          <p className="text-xs text-blue-100 flex items-center justify-center lg:justify-start gap-2 mt-4 border-t border-blue-500 pt-4">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            No credit card required • Takes under 2 minutes
          </p>
        </div>
      </section>

      {/* MOBILE STICKY CTA BAR - Solid background */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 border-t-2 border-blue-700 shadow-xl z-50 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Get Your Free Report</p>
              <p className="text-blue-100 text-xs">Takes less than 2 minutes</p>
            </div>
            <Link
              href="/get-report/step-1"
              className="bg-white text-blue-600 px-5 py-2.5 rounded-md font-bold text-sm hover:bg-gray-50 transition shadow-md whitespace-nowrap"
            >
              Start Now →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
