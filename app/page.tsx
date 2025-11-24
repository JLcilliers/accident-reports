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
          {/* Darker overlay for dark theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#05070B]/85 via-[#05070B]/60 to-[#05070B]/95 z-10"></div>
          {/* Top vignette for better nav contrast */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/15 to-transparent z-10"></div>
          <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>

        {/* Left accent bar - neon green accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#B6FF2C] via-[#8EE522] to-[#B6FF2C] z-20 hidden lg:block shadow-lg"></div>

        {/* Content container - max-width 1200px, left-aligned */}
        <div className="container mx-auto px-6 lg:px-12 relative z-20 py-16 lg:py-28 max-w-[1200px]">
          <div className="max-w-[560px] ml-[10px] lg:ml-[20px]">
            {/* Trust Badges - Pill style with precise spacing */}
            <div className="flex flex-wrap items-center gap-2 mb-7">
              <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-full border border-white/20 shadow">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">10,000+ Reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-full border border-white/20 shadow">
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

            {/* CTAs - Neon green primary, secondary transparent with green border */}
            <div className="flex flex-col sm:flex-row gap-4 mb-7">
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center justify-center bg-[#B6FF2C] text-[#05070B] px-8 py-4 min-h-[48px] rounded-lg font-bold text-base hover:bg-[#8EE522] transition-all shadow-lg hover:shadow-[0_0_18px_rgba(182,255,44,0.35)]"
              >
                Find My Accident Report
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <Link
                href="/legal-help"
                className="inline-flex items-center justify-center bg-transparent text-[#B6FF2C] px-7 py-3.5 min-h-[48px] rounded-lg font-semibold text-base hover:bg-[#B6FF2C]/10 transition-all border border-[#8EE522]"
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

      {/* HOW IT WORKS SECTION - Dark background with neon hover effects */}
      <section className="py-16 lg:py-24 bg-[#05070B]">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">How It Works</h2>
            <p className="text-lg text-[#A5B1C5] leading-relaxed">Simple, fast, and completely free</p>
          </div>

          {/* Three cards with dark base and neon green hover effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="how-card group bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:bg-[#B6FF2C] hover:transform hover:-translate-y-[10px] hover:shadow-[0_22px_45px_rgba(182,255,44,0.55)] hover:border-transparent overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#B6FF2C]/8 text-[#B6FF2C] group-hover:bg-[#05070B] group-hover:text-[#B6FF2C] transition-colors duration-[220ms]">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <svg className="w-8 h-8 text-[#B6FF2C] group-hover:text-[#05070B] transition-colors duration-[220ms]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#05070B] transition-colors duration-[220ms]">Tell Us About Your Accident</h3>
              <p className="text-[#A5B1C5] leading-relaxed text-base group-hover:text-[#05070B] transition-colors duration-[220ms]">
                Provide basic details about when and where your accident occurred.
                Takes less than 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="how-card group bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:bg-[#B6FF2C] hover:transform hover:-translate-y-[10px] hover:shadow-[0_22px_45px_rgba(182,255,44,0.55)] hover:border-transparent overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#B6FF2C]/8 text-[#B6FF2C] group-hover:bg-[#05070B] group-hover:text-[#B6FF2C] transition-colors duration-[220ms]">
                  <span className="text-sm font-semibold">2</span>
                </div>
                <svg className="w-8 h-8 text-[#B6FF2C] group-hover:text-[#05070B] transition-colors duration-[220ms]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#05070B] transition-colors duration-[220ms]">We Locate Your Report</h3>
              <p className="text-[#A5B1C5] leading-relaxed text-base group-hover:text-[#05070B] transition-colors duration-[220ms]">
                Our system searches official databases to find your accident or police report.
              </p>
            </div>

            {/* Step 3 */}
            <div className="how-card group bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:bg-[#B6FF2C] hover:transform hover:-translate-y-[10px] hover:shadow-[0_22px_45px_rgba(182,255,44,0.55)] hover:border-transparent overflow-hidden">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#B6FF2C]/8 text-[#B6FF2C] group-hover:bg-[#05070B] group-hover:text-[#B6FF2C] transition-colors duration-[220ms]">
                  <span className="text-sm font-semibold">3</span>
                </div>
                <svg className="w-8 h-8 text-[#B6FF2C] group-hover:text-[#05070B] transition-colors duration-[220ms]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#05070B] transition-colors duration-[220ms]">Get Your Report + Legal Help</h3>
              <p className="text-[#A5B1C5] leading-relaxed text-base group-hover:text-[#05070B] transition-colors duration-[220ms]">
                Download your report for free and get a no-obligation case review
                from experienced attorneys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / STATS SECTION - Dark background with subtle gradient */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-[#0B1018] to-[#05070B] border-t border-[#1C2430]">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Trusted by Accident Victims Nationwide
            </h2>
            <div className="w-20 h-1 bg-[#B6FF2C] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Stats with vertical dividers and neon green accents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Stat 1 */}
            <div className="bg-[#0C1016] rounded-lg p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-[#1C2430] hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition-shadow relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#B6FF2C] rounded-lg mb-5 shadow-lg">
                <svg className="w-8 h-8 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div className="text-5xl font-bold text-[#B6FF2C] mb-2 tracking-tight">10,000+</div>
              <p className="text-[#A5B1C5] font-semibold text-sm uppercase tracking-wide">Reports Delivered</p>
            </div>

            {/* Vertical divider - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-px h-24 bg-[#1C2430]"></div>

            {/* Stat 2 */}
            <div className="bg-[#0C1016] rounded-lg p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-[#1C2430] hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition-shadow relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#B6FF2C] rounded-lg mb-5 shadow-lg">
                <svg className="w-8 h-8 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-5xl font-bold text-[#B6FF2C] mb-2 tracking-tight">24/7</div>
              <p className="text-[#A5B1C5] font-semibold text-sm uppercase tracking-wide">Support Available</p>
            </div>

            {/* Vertical divider - hidden on mobile */}
            <div className="hidden md:block absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-px h-24 bg-[#1C2430]"></div>

            {/* Stat 3 */}
            <div className="bg-[#0C1016] rounded-lg p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-[#1C2430] hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition-shadow relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#B6FF2C] rounded-lg mb-5 shadow-lg">
                <svg className="w-8 h-8 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="text-5xl font-bold text-[#B6FF2C] mb-2 tracking-tight">100%</div>
              <p className="text-[#A5B1C5] font-semibold text-sm uppercase tracking-wide">Free Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION - Two-column layout with 35/65 split */}
      <section className="py-16 lg:py-24 bg-[#05070B]">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Left column - Section header with neon accent bar (35% width) */}
            <div className="lg:col-span-4 mb-10 lg:mb-0 lg:pr-8 border-l-4 border-[#B6FF2C] pl-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Why Choose Us?</h2>
              <p className="text-lg text-[#A5B1C5] leading-relaxed mb-6">
                Everything you need to get your accident report and legal support
              </p>
              <div className="hidden lg:block w-16 h-1 bg-[#B6FF2C] rounded-full"></div>
            </div>

            {/* Right column - 2x2 benefit grid (65% width) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="bg-[#0C1016] rounded-lg p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition-shadow">
                <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mb-4 shadow">
                  <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Completely Free</h3>
                <p className="text-[#A5B1C5] text-base leading-relaxed">
                  No hidden fees, no credit card required. Get your accident report at absolutely no cost.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-[#0C1016] rounded-lg p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition-shadow">
                <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mb-4 shadow">
                  <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Fast & Easy</h3>
                <p className="text-[#A5B1C5] text-base leading-relaxed">
                  Simple online process that takes minutes. No need to visit government offices.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-[#0C1016] rounded-lg p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition-shadow">
                <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mb-4 shadow">
                  <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Secure & Confidential</h3>
                <p className="text-[#A5B1C5] text-base leading-relaxed">
                  Your information is protected with industry-standard encryption and security.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-[#0C1016] rounded-lg p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition-shadow">
                <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mb-4 shadow">
                  <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Legal Support Available</h3>
                <p className="text-[#A5B1C5] text-base leading-relaxed">
                  Connect with experienced attorneys for a free case review if you were injured.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER SECTION - Dark gradient with neon green button */}
      <section className="relative min-h-[220px] py-16 lg:py-20 bg-gradient-to-br from-[#05070B] via-[#0B1018] to-[#05070B] overflow-hidden border-t border-[#1C2430]">
        {/* Subtle dot texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'%23ffffff\'/%3E%3C/svg%3E")'
        }}></div>

        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] relative">
          <div className="lg:flex lg:items-center lg:gap-12 text-center lg:text-left">
            <div className="mb-8 lg:mb-0 lg:flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to Get Your Accident Report?
              </h2>
              <p className="text-lg text-[#A5B1C5] leading-relaxed">
                Start now and get your free report in minutes
              </p>
            </div>
            <div className="lg:flex-shrink-0">
              <Link
                href="/get-report/step-1"
                className="inline-flex items-center justify-center bg-[#B6FF2C] text-[#05070B] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#8EE522] transition-all shadow-lg hover:shadow-[0_0_18px_rgba(182,255,44,0.35)]"
              >
                Get Started Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
              <p className="text-sm text-[#A5B1C5] mt-4 flex items-center justify-center lg:justify-start gap-2">
                <svg className="w-4 h-4 text-[#B6FF2C] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                No credit card required • Takes under 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#0C1016] to-[#05070B] border-t-2 border-[#1C2430] shadow-2xl z-50 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Get Your Free Report</p>
              <p className="text-[#A5B1C5] text-xs">Takes less than 2 minutes</p>
            </div>
            <Link
              href="/get-report/step-1"
              className="bg-[#B6FF2C] text-[#05070B] px-6 py-2.5 rounded-md font-bold text-sm hover:bg-[#8EE522] transition shadow-lg whitespace-nowrap"
            >
              Start Now →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
