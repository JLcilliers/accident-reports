import Link from "next/link";
import SearchHero from "@/components/search/SearchHero";

export default function Home() {
  return (
    <>
      {/* HERO SECTION with Search */}
      <SearchHero />

      {/* FEATURE TILES - "What You Can Do Here" */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              What You Can Do Here
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              AccidentLookup helps you find accident information and understand your options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                <svg className="w-6 h-6 text-blue-800 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Search Recent Car Accidents</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Find information about traffic accidents in your area by location, date, or road.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                <svg className="w-6 h-6 text-blue-800 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Get Your Police Report</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Learn how to obtain your official accident or police report from local authorities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                <svg className="w-6 h-6 text-blue-800 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Understand Your Legal Options</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect with experienced personal injury attorneys for a free case evaluation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                <svg className="w-6 h-6 text-blue-800 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Browse by City or Highway</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Explore accidents organized by location, including major highways and intersections.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                <svg className="w-6 h-6 text-blue-800 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Read Safety & Recovery Guides</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Access helpful resources on what to do after an accident and how to recover.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                <svg className="w-6 h-6 text-blue-800 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Stay Informed</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Get updates on traffic incidents and road safety news in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STAY IN THE KNOW SECTION */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="mb-10 lg:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Stay In-The-Know About Local Accidents
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                We monitor public reports, news sources, and official records to bring you timely information about traffic accidents in your area. Our team publishes clear, factual summaries to help you stay informed.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">Updated throughout the day as new information becomes available</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">Easy-to-understand summaries with key details</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-slate-700">Coverage across all 50 states</span>
                </li>
              </ul>
              <Link
                href="/accidents"
                className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-900 font-semibold transition"
              >
                Browse Latest Accidents
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>

            {/* Right - Sample Accident Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">Recent</span>
                  <span className="text-slate-500 text-sm">2 hours ago</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Two-Vehicle Collision on I-25 near Downtown Denver
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Denver, CO
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Today, 3:45 PM
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  A two-vehicle collision was reported on I-25 northbound near the downtown exits. Injuries have been reported. Traffic is backed up for approximately 2 miles.
                </p>
                <Link
                  href="/accidents/colorado/denver/i-25-collision-example"
                  className="text-blue-800 hover:text-blue-900 font-medium text-sm flex items-center gap-1"
                >
                  View Full Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT CAN I FIND SECTION */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              What Information Can I Find?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our database includes details about traffic accidents from public sources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Info Card 1 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Accident Details</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Date, time, and exact location of the incident including street names and intersections.
              </p>
            </div>

            {/* Info Card 2 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Injury Information</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                General information about injuries or fatalities when reported in public records.
              </p>
            </div>

            {/* Info Card 3 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Road Closures</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Information about traffic impacts, road closures, and alternate routes when available.
              </p>
            </div>

            {/* Info Card 4 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Next Steps & Resources</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Guidance on what to do if you were involved, including legal and insurance information.
              </p>
            </div>

            {/* Info Card 5 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Official Source Links</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Links to official sources, news reports, and agencies for more detailed information.
              </p>
            </div>

            {/* Info Card 6 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Updates & Corrections</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Articles are updated as investigations progress and new information becomes available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              How We Have Helped
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Real stories from people who found the information they needed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                &ldquo;My dad was in an accident and we couldn&apos;t get details from the hospital. This site helped us understand what happened and connected us with a great attorney.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-semibold text-sm">MR</span>
                </div>
                <div>
                  <p className="text-slate-900 font-medium text-sm">Maria R.</p>
                  <p className="text-slate-500 text-xs">Denver, CO</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                &ldquo;I witnessed a crash and wanted to know if everyone was okay. Found the information here the next day. Very helpful and respectfully written.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-800 font-semibold text-sm">JT</span>
                </div>
                <div>
                  <p className="text-slate-900 font-medium text-sm">James T.</p>
                  <p className="text-slate-500 text-xs">Phoenix, AZ</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                &ldquo;The guide on getting my police report saved me hours. I didn&apos;t know which department to contact until I read their step-by-step instructions.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-800 font-semibold text-sm">SK</span>
                </div>
                <div>
                  <p className="text-slate-900 font-medium text-sm">Sarah K.</p>
                  <p className="text-slate-500 text-xs">Austin, TX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY USE US SECTION */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Why Choose AccidentLookup?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We handle accident information with care and professionalism
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Reason 1 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Fast Publishing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Incident articles published quickly after public reports become available.
              </p>
            </div>

            {/* Reason 2 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Clear Language</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Non-technical, easy-to-understand summaries of what happened.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Vetted Attorneys</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connections to experienced local personal injury lawyers.
              </p>
            </div>

            {/* Reason 4 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Respectful Coverage</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We handle sensitive information with care and dignity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0 lg:max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Need Legal Help After an Accident?
              </h2>
              <p className="text-blue-100 leading-relaxed">
                Connect with experienced personal injury attorneys who can review your case for free. No obligation, completely confidential.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/legal-help"
                className="inline-flex items-center justify-center bg-white text-blue-800 px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
              >
                Get Free Case Review
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center bg-transparent text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all border border-white/30"
              >
                Search Accidents
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-slate-900 font-semibold text-sm">Find Accident Info</p>
              <p className="text-slate-500 text-xs">Free to search</p>
            </div>
            <Link
              href="/search"
              className="bg-blue-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-900 transition shadow whitespace-nowrap"
            >
              Search Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
