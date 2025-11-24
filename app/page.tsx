import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO SECTION - Left-aligned professional layout */}
      <section className="relative text-white overflow-hidden min-h-[680px] lg:min-h-[760px] flex items-center">
        {/* Video Background - unchanged */}
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
          {/* Solid dark overlay with subtle texture */}
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          {/* Top vignette for better nav contrast */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/15 to-transparent z-10"></div>
          <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>

        {/* Left accent bar - professional visual anchor */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 z-20 hidden lg:block shadow-lg"></div>

        {/* Content container - max-width 1200px, left-aligned */}
        <div className="container mx-auto px-6 lg:px-12 relative z-20 py-16 lg:py-28 max-w-[1200px]">
          <div className="max-w-2xl">
            {/* Trust Badges - Subtle borders, spaced apart */}
            <div className="flex flex-wrap items-center gap-4 mb-7">
              <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded border border-white/30 shadow">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">10,000+ Reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded border border-white/30 shadow">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Secure</span>
              </div>
            </div>

            {/* Headline - Large and dominant */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              Get Your Accident Report Online – Free
            </h1>

            {/* Subheadline - 18px with good line height */}
            <p className="text-lg md:text-xl mb-8 text-gray-50 leading-relaxed max-w-xl">
              We locate and deliver your accident or police report at no cost.
              Plus, get a free case review from experienced personal injury attorneys.
            </p>

            {/* CTAs - Emphasized primary, outlined secondary */}
            <div className="flex flex-col sm:flex-row gap-4 mb-7">
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-md font-bold text-base hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Find My Accident Report
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <Link
                href="/legal-help"
                className="inline-flex items-center justify-center bg-transparent text-white px-7 py-3.5 rounded-md font-semibold text-base hover:bg-white/10 transition-all border-2 border-white/60"
              >
                Get Free Case Review
              </Link>
            </div>

            {/* Trust Microcopy */}
            <p className="text-base text-gray-100 flex items-center gap-2 leading-relaxed">
              <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              No credit card required • 100% confidential • Takes under 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - Clean three-card layout */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">How It Works</h2>
            <p className="text-lg text-gray-600 leading-relaxed">Simple, fast, and completely free</p>
          </div>

          {/* Three elevated cards - content-driven heights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-7 shadow border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tell Us About Your Accident</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                Provide basic details about when and where your accident occurred.
                Takes less than 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-7 shadow border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Locate Your Report</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                Our system searches official databases to find your accident or police report.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-7 shadow border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Report + Legal Help</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                Download your report for free and get a no-obligation case review
                from experienced attorneys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / STATS SECTION - Light tinted background */}
      <section className="py-16 lg:py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Trusted by Accident Victims Nationwide
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Stats with vertical dividers and varied colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Stat 1 - Blue */}
            <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-5 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div className="text-5xl font-bold text-blue-600 mb-2 tracking-tight">10,000+</div>
              <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Reports Delivered</p>
            </div>

            {/* Vertical divider - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[2px] h-24 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Stat 2 - Green */}
            <div className="bg-white rounded-lg p-8 text-center shadow-lg border-2 border-green-100 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-lg mb-5 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-5xl font-bold text-green-600 mb-2 tracking-tight">24/7</div>
              <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Support Available</p>
            </div>

            {/* Vertical divider - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[2px] h-24 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Stat 3 - Teal */}
            <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-lg mb-5 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-5xl font-bold text-teal-600 mb-2 tracking-tight">100%</div>
              <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Free Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION - Two-column layout */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Left column - Section header with accent bar */}
            <div className="lg:col-span-5 mb-10 lg:mb-0 lg:pr-8 border-l-4 border-blue-600 pl-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Why Choose Us?</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Everything you need to get your accident report and legal support
              </p>
              <div className="hidden lg:block w-16 h-1 bg-blue-600 rounded-full"></div>
            </div>

            {/* Right column - 2x2 benefit grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Completely Free</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  No hidden fees, no credit card required. Get your accident report at absolutely no cost.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fast & Easy</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Simple online process that takes minutes. No need to visit government offices.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Confidential</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Your information is protected with industry-standard encryption and security.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Legal Support Available</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Connect with experienced attorneys for a free case review if you were injured.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER SECTION - Blue background with subtle texture */}
      <section className="relative py-16 lg:py-20 bg-blue-600 overflow-hidden">
        {/* Subtle dot texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'%23ffffff\'/%3E%3C/svg%3E")'
        }}></div>

        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] relative">
          <div className="lg:flex lg:items-center lg:gap-12 lg:justify-center text-center lg:text-left">
            <div className="mb-8 lg:mb-0 lg:flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to Get Your Accident Report?
              </h2>
              <p className="text-lg text-blue-50 leading-relaxed">
                Start now and get your free report in minutes
              </p>
            </div>
            <div className="lg:flex-shrink-0">
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-md font-bold text-base hover:bg-gray-50 transition-all shadow-lg"
              >
                Get Started Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <p className="text-sm text-blue-100 mt-4 flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4 text-blue-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                No credit card required • Takes under 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 border-t-2 border-blue-800 shadow-2xl z-50 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Get Your Free Report</p>
              <p className="text-blue-100 text-xs">Takes less than 2 minutes</p>
            </div>
            <Link
              href="/get-report/step-1"
              className="bg-white text-blue-600 px-6 py-2.5 rounded-md font-bold text-sm hover:bg-gray-50 transition shadow-lg whitespace-nowrap"
            >
              Start Now →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
