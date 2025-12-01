import Link from "next/link";
import VideoHero from "@/components/hero/VideoHero";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://accident-reports.vercel.app";

// JSON-LD Organization structured data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AccidentReports",
  url: BASE_URL,
  description:
    "Search recent traffic accidents compiled from publicly available news sources. Find accident information by location, date, and road.",
  sameAs: [],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* HERO SECTION with Video Background */}
      <VideoHero />

      {/* FEATURE TILES - Clean minimal cards */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-3 tracking-tight">
              What You Can Do
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Find accident information and understand your options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-neutral-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Search Recent Accidents</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Find traffic accidents in your area by location, date, or road.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-neutral-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Get Your Police Report</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Learn how to obtain your official accident report from local authorities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-neutral-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Understand Legal Options</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Connect with personal injury attorneys for a free case evaluation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-neutral-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Browse by Location</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Explore accidents by city, state, or major highways.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-neutral-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Safety Guides</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Resources on what to do after an accident and recovery steps.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-neutral-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-6 h-6 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Stay Informed</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Get updates on traffic incidents in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STAY IN THE KNOW SECTION */}
      <section className="py-20 lg:py-28 bg-[#F7F7F7]">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="mb-12 lg:mb-0">
              <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-5 tracking-tight">
                Stay Informed About Local Accidents
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-8">
                We compile information from publicly available news sources to bring you timely, factual summaries about traffic accidents in your area.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8F5F2] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-[#2A7D6E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-neutral-600 text-sm">Updated daily as new information becomes available</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8F5F2] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-[#2A7D6E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-neutral-600 text-sm">Clear, factual summaries with key details</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8F5F2] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-[#2A7D6E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-neutral-600 text-sm">Growing coverage across multiple states</span>
                </li>
              </ul>
              <Link
                href="/accidents"
                className="inline-flex items-center gap-2 text-[#2A7D6E] hover:text-[#236859] font-medium transition-colors text-sm"
              >
                Browse Latest News
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
            </div>

            {/* Right - Sample Accident Card */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#FEF3C7] text-[#B45309] text-xs font-medium px-3 py-1 rounded-full">Recent</span>
                  <span className="text-neutral-400 text-sm">2 hours ago</span>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">
                  Two-Vehicle Collision on I-25 near Downtown Denver
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-4">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                    Denver, CO
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Today, 3:45 PM
                  </span>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed mb-5">
                  A two-vehicle collision was reported on I-25 northbound near the downtown exits. Injuries have been reported. Traffic is backed up for approximately 2 miles.
                </p>
                <Link
                  href="/accidents/colorado/denver/i-25-collision-example"
                  className="text-[#2A7D6E] hover:text-[#236859] font-medium text-sm flex items-center gap-1.5 transition-colors"
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT CAN I FIND SECTION */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-3 tracking-tight">
              What Information Can You Find?
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Our database includes details from public sources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Info Card 1 */}
            <div className="bg-white rounded-2xl p-7 border border-neutral-100 hover:border-neutral-200 transition-all">
              <div className="w-10 h-10 bg-[#F7F7F7] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Accident Details</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Date, time, and exact location including street names and intersections.
              </p>
            </div>

            {/* Info Card 2 */}
            <div className="bg-white rounded-2xl p-7 border border-neutral-100 hover:border-neutral-200 transition-all">
              <div className="w-10 h-10 bg-[#F7F7F7] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Injury Information</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                General information about injuries when reported in public records.
              </p>
            </div>

            {/* Info Card 3 */}
            <div className="bg-white rounded-2xl p-7 border border-neutral-100 hover:border-neutral-200 transition-all">
              <div className="w-10 h-10 bg-[#F7F7F7] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Road Closures</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Traffic impacts, road closures, and alternate routes when available.
              </p>
            </div>

            {/* Info Card 4 */}
            <div className="bg-white rounded-2xl p-7 border border-neutral-100 hover:border-neutral-200 transition-all">
              <div className="w-10 h-10 bg-[#F7F7F7] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Next Steps</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Guidance on what to do if you were involved, including legal options.
              </p>
            </div>

            {/* Info Card 5 */}
            <div className="bg-white rounded-2xl p-7 border border-neutral-100 hover:border-neutral-200 transition-all">
              <div className="w-10 h-10 bg-[#F7F7F7] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Official Sources</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Links to news reports and agencies for detailed information.
              </p>
            </div>

            {/* Info Card 6 */}
            <div className="bg-white rounded-2xl p-7 border border-neutral-100 hover:border-neutral-200 transition-all">
              <div className="w-10 h-10 bg-[#F7F7F7] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Regular Updates</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Articles updated as investigations progress and new information arrives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 lg:py-28 bg-[#F7F7F7]">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-3 tracking-tight">
              How We Have Helped
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Stories from people who found the information they needed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 border border-neutral-100">
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#2A7D6E]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                &ldquo;My dad was in an accident and we couldn&apos;t get details from the hospital. This site helped us understand what happened and connected us with a great attorney.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F5F2] rounded-full flex items-center justify-center">
                  <span className="text-[#2A7D6E] font-medium text-sm">MR</span>
                </div>
                <div>
                  <p className="text-neutral-900 font-medium text-sm">Maria R.</p>
                  <p className="text-neutral-400 text-xs">Denver, CO</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 border border-neutral-100">
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#2A7D6E]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                &ldquo;I witnessed a crash and wanted to know if everyone was okay. Found the information here the next day. Very helpful and respectfully written.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F5F2] rounded-full flex items-center justify-center">
                  <span className="text-[#2A7D6E] font-medium text-sm">JT</span>
                </div>
                <div>
                  <p className="text-neutral-900 font-medium text-sm">James T.</p>
                  <p className="text-neutral-400 text-xs">Phoenix, AZ</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 border border-neutral-100">
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#2A7D6E]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                &ldquo;The guide on getting my police report saved me hours. I didn&apos;t know which department to contact until I read their step-by-step instructions.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F5F2] rounded-full flex items-center justify-center">
                  <span className="text-[#2A7D6E] font-medium text-sm">SK</span>
                </div>
                <div>
                  <p className="text-neutral-900 font-medium text-sm">Sarah K.</p>
                  <p className="text-neutral-400 text-xs">Austin, TX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY USE US SECTION */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-3 tracking-tight">
              Why AccidentLookup?
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              We handle accident information with care and professionalism
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Reason 1 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-[#E8F5F2] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Fast Publishing</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Articles published quickly after public reports become available.
              </p>
            </div>

            {/* Reason 2 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-[#E8F5F2] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Clear Language</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Non-technical, easy-to-understand summaries of what happened.
              </p>
            </div>

            {/* Reason 3 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-[#E8F5F2] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Vetted Attorneys</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Connections to experienced local personal injury lawyers.
              </p>
            </div>

            {/* Reason 4 */}
            <div className="text-center">
              <div className="w-14 h-14 bg-[#E8F5F2] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                </svg>
              </div>
              <h3 className="text-base font-medium text-neutral-900 mb-2">Respectful Coverage</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                We handle sensitive information with care and dignity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER - Clean minimal style */}
      <section className="py-20 lg:py-28 bg-neutral-900">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="mb-10 lg:mb-0 lg:max-w-xl">
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight">
                Need Legal Help After an Accident?
              </h2>
              <p className="text-neutral-300 leading-relaxed">
                Connect with personal injury attorneys who can review your case. Free consultation, no obligation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/legal-help"
                className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
              >
                Get Free Case Review
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all border border-neutral-700"
              >
                Search Accidents
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-50 lg:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-neutral-900 font-medium text-sm">Find Accident Info</p>
              <p className="text-neutral-400 text-xs">Free to search</p>
            </div>
            <Link
              href="/search"
              className="bg-[#2A7D6E] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#236859] transition whitespace-nowrap"
            >
              Search Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
