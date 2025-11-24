import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO SECTION - Enhanced asymmetry with accent bar */}
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
              pointerEvents: 'none',
              filter: 'brightness(1.1) contrast(1.15)'
            }}
          />
          {/* Solid dark overlay with subtle texture */}
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>

        {/* Left accent bar - human touch */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-600 to-transparent z-20 hidden lg:block"></div>

        {/* Content - Offset left, not perfectly centered */}
        <div className="container mx-auto px-6 lg:px-20 relative z-20 py-16 lg:py-28">
          <div className="max-w-2xl lg:ml-4">
            {/* Trust Badges - Varied sizes */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-bold">10,000+ Reports</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm px-3 py-2 rounded border border-white/15">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Secure</span>
              </div>
            </div>

            {/* Headline - Professional size with better hierarchy */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-[1.15] tracking-tight">
              Get Your Accident Report Online – Free
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg mb-9 text-gray-50 leading-relaxed">
              We locate and deliver your accident or police report at no cost.
              Plus, get a free case review from experienced personal injury attorneys.
            </p>

            {/* CTAs - Clear hierarchy: primary dominant, secondary subtle */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-md font-bold text-base hover:bg-blue-700 transition-all shadow-2xl hover:shadow-blue-600/50 border border-blue-500"
              >
                Find My Accident Report
                <svg className="w-5 h-5 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <Link
                href="/legal-help"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-6 py-3.5 rounded-md font-medium text-base hover:bg-white/20 transition border border-white/30"
              >
                Get Free Case Review
              </Link>
            </div>

            {/* Trust Microcopy */}
            <p className="text-sm text-gray-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              No credit card required • 100% confidential • Takes under 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - Left-aligned cards with varied styling */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="mb-14 border-l-4 border-blue-600 pl-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">How It Works</h2>
            <p className="text-base text-gray-600">Simple, fast, and completely free</p>
          </div>

          {/* Varied card layout - different heights, colors, shadows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-9">
            {/* Step 1 - Blue accent, elevated */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-blue-100 md:-mt-3 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-blue-600 rounded w-11 h-11 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tell Us About Your Accident</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Provide basic details about when and where your accident occurred.
                Takes less than 2 minutes.
              </p>
            </div>

            {/* Step 2 - Gray background, normal position */}
            <div className="bg-gray-50 rounded-lg p-8 shadow border border-gray-300 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-green-600 rounded w-11 h-11 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Locate Your Report</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Our system searches official databases to find your accident or police report.
              </p>
            </div>

            {/* Step 3 - White with green accent, elevated */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-green-600 md:-mt-3 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-green-600 rounded w-11 h-11 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Report + Legal Help</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Download your report for free and get a no-obligation case review
                from experienced attorneys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / STATS SECTION - Subtle stripe background */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white border-t-2 border-gray-200">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Trusted by Accident Victims Nationwide
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Stats with vertical dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Stat 1 */}
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
            <div className="hidden md:block absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-px h-24 bg-gray-300"></div>

            {/* Stat 2 */}
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
            <div className="hidden md:block absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-px h-24 bg-gray-300"></div>

            {/* Stat 3 */}
            <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-5 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-5xl font-bold text-blue-600 mb-2 tracking-tight">100%</div>
              <p className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Free Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION - Two-column layout */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Left column - Section header */}
            <div className="lg:col-span-5 mb-10 lg:mb-0 lg:pr-8 border-l-4 border-blue-600 pl-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Why Choose Us?</h2>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Everything you need to get your accident report and legal support
              </p>
              <div className="hidden lg:block w-16 h-1 bg-blue-600 rounded-full"></div>
            </div>

            {/* Right column - 2x2 benefit cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Benefit 1 - Blue accent */}
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600 shadow hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Completely Free</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  No hidden fees, no credit card required. Get your accident report at absolutely no cost.
                </p>
              </div>

              {/* Benefit 2 - White with shadow */}
              <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-md hover:shadow-lg transition-shadow sm:mt-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fast & Easy</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Simple online process that takes minutes. No need to visit government offices.
                </p>
              </div>

              {/* Benefit 3 - Gray background */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-300 shadow hover:shadow-md transition-shadow sm:-mt-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Confidential</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your information is protected with industry-standard encryption and security.
                </p>
              </div>

              {/* Benefit 4 - Green accent */}
              <div className="bg-white rounded-lg p-6 border-l-4 border-green-600 shadow-md hover:shadow-lg transition-shadow sm:mt-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Legal Support Available</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Connect with experienced attorneys for a free case review if you were injured.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER SECTION - Subtle gradient with texture */}
      <section className="relative py-18 lg:py-22 bg-gradient-to-br from-blue-600 to-blue-700 border-t-4 border-blue-800 overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>

        {/* Left accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400/30 hidden lg:block"></div>

        <div className="container mx-auto px-6 lg:px-12 max-w-5xl relative">
          <div className="lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="mb-6 lg:mb-0 lg:flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                Ready to Get Your Accident Report?
              </h2>
              <p className="text-base text-blue-50 leading-relaxed">
                Start now and get your free report in minutes
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center justify-center bg-white text-blue-600 px-9 py-4 rounded-md font-bold text-base hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/30 whitespace-nowrap"
              >
                Get Started Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-blue-500/40">
            <svg className="w-4 h-4 text-blue-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-blue-100">
              No credit card required • Takes under 2 minutes
            </p>
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
