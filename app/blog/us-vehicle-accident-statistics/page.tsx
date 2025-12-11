import { Metadata } from "next";
import Link from "next/link";
import { TableOfContents, StatCard } from "@/components/blog";
import { getBlogPost } from "@/data/blog-posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://accident-reports.vercel.app";
const post = getBlogPost("us-vehicle-accident-statistics");
const LAST_UPDATED = "December 2025";

export const metadata: Metadata = {
  title: "United States Car Accident Statistics, Causes, and Prevention (2025) | AccidentLookup",
  description: "Fresh United States car accident statistics, causes, and safety tips. Explore 2023 crash data, high-risk groups, and evidence-based prevention strategies.",
  alternates: {
    canonical: `${BASE_URL}/blog/us-vehicle-accident-statistics`,
  },
  openGraph: {
    title: "United States Car Accident Statistics, Causes, and Prevention (2025)",
    description: "Fresh United States car accident statistics, causes, and safety tips. Explore 2023 crash data, high-risk groups, and evidence-based prevention strategies.",
    url: `${BASE_URL}/blog/us-vehicle-accident-statistics`,
    siteName: "AccidentLookup",
    type: "article",
    publishedTime: post?.publishedAt,
    modifiedTime: post?.updatedAt,
  },
};

// Table of contents items
const tocItems = [
  { id: "quick-facts", title: "Quick Facts: The Big Picture", level: 2 },
  { id: "how-big", title: "How Big is the Problem?", level: 2 },
  { id: "who-at-risk", title: "Who is Most at Risk?", level: 2 },
  { id: "where-when", title: "Where and When Crashes Happen", level: 2 },
  { id: "leading-causes", title: "Leading Causes and Risk Factors", level: 2 },
  { id: "economic-costs", title: "Economic and Social Costs", level: 2 },
  { id: "prevention", title: "Evidence-Based Prevention", level: 2 },
  { id: "after-crash", title: "What to Do After a Crash", level: 2 },
  { id: "case-studies", title: "Case Studies", level: 2 },
  { id: "data-sources", title: "Key Data Sources", level: 2 },
  { id: "faq", title: "FAQ", level: 2 },
];

// JSON-LD structured data
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "United States Vehicle Accident Statistics, Causes, and Prevention",
  description: "Fresh United States car accident statistics, causes, and safety tips. Explore 2023 crash data, high-risk groups, and evidence-based prevention strategies.",
  datePublished: post?.publishedAt,
  dateModified: post?.updatedAt,
  author: {
    "@type": "Organization",
    name: "AccidentLookup Research Team",
  },
  publisher: {
    "@type": "Organization",
    name: "AccidentLookup",
    url: BASE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${BASE_URL}/blog/us-vehicle-accident-statistics`,
  },
  about: ["traffic safety", "car crashes", "motor vehicle accidents", "road safety statistics"],
  citation: [
    "https://crashstats.nhtsa.dot.gov/Api/Public/Publication/813705",
    "https://www.cdc.gov/transportation-safety/about/index.html",
    "https://www.iihs.org/research-areas/fatality-statistics/detail/yearly-snapshot",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many people die in United States car crashes each year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Recent data show 2022: almost 44,000 motor vehicle crash deaths, 2023: 40,901 deaths, 2024 (preliminary): about 39,345 deaths. That is still more than 100 people killed in crashes every single day.",
      },
    },
    {
      "@type": "Question",
      name: "Are United States roads getting safer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In the short term, yes. Fatalities and fatality rates have declined modestly from pandemic era peaks, and early 2025 data show continued improvement. In the longer term, though, deaths remain substantially higher than a decade ago and significantly higher than in comparable high income countries.",
      },
    },
    {
      "@type": "Question",
      name: "What are the top causes of fatal crashes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The big four risk factors are: Speeding, Alcohol-impaired driving, Failure to wear seat belts or use child restraints, and Distracted driving.",
      },
    },
  ],
};

export default function USVehicleAccidentStatisticsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="bg-[#F7F7F7] min-h-screen">
        {/* Hero Section */}
        <div className="bg-white border-b border-neutral-100">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 lg:py-16 max-w-[1200px]">
            <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
              <Link href="/" className="hover:text-[#2A7D6E] transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
              </svg>
              <Link href="/blog" className="hover:text-[#2A7D6E] transition-colors">Blog</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
              </svg>
              <span className="text-neutral-900">Statistics</span>
            </nav>

            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-[#E8F5F2] text-[#2A7D6E] text-xs font-medium px-3 py-1.5 rounded-full">
                  Statistics & Research
                </span>
                <span className="text-neutral-400 text-sm">Last updated: {LAST_UPDATED}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-neutral-900 mb-6 tracking-tight leading-tight">
                United States Vehicle Accident Statistics, Causes, and Prevention
              </h1>

              <p className="text-lg text-neutral-500 leading-relaxed mb-8">
                Every day in the United States, road crashes change lives in an instant. In 2023 alone,
                federal crash data record <strong className="text-neutral-700">40,901 people killed</strong> and
                about <strong className="text-neutral-700">2.44 million people injured</strong> in police-reported
                motor vehicle traffic crashes.
              </p>

              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#E8F5F2] rounded-full flex items-center justify-center">
                    <span className="text-[#2A7D6E] font-medium text-xs">AR</span>
                  </div>
                  <span>AccidentLookup Research Team</span>
                </div>
                <span className="text-neutral-300">•</span>
                <span>25 min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Banner */}
        <div className="bg-neutral-900 py-8">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1200px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-medium text-white mb-1">~112</p>
                <p className="text-sm text-neutral-400">People killed daily</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-medium text-white mb-1">13 min</p>
                <p className="text-sm text-neutral-400">One death every</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-medium text-white mb-1">40,901</p>
                <p className="text-sm text-neutral-400">Deaths in 2023</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-medium text-white mb-1">2.44M</p>
                <p className="text-sm text-neutral-400">Injured in 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 lg:py-16 max-w-[1400px]">
          <div className="flex gap-12">
            {/* Article Content */}
            <article className="flex-1 max-w-3xl">
              {/* Intro */}
              <div className="prose-section mb-12">
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Early numbers for 2024 suggest about <strong>39,345 traffic deaths</strong>, a 3.8 percent drop
                  from 2023, but still higher than pre-pandemic levels.{" "}
                  <a href="https://www.reuters.com/world/us/us-traffic-deaths-fell-38-2024-lowest-number-since-2020-2025-04-08/" target="_blank" rel="noopener noreferrer" className="text-[#2A7D6E] hover:underline">(Reuters)</a>
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  This page is designed as a comprehensive, citable hub for United States vehicle accident data,
                  causes, and prevention strategies. It pulls together recent national statistics, highlights
                  high-risk scenarios and road users, and ends with practical recommendations and case-style
                  examples your audience can learn from.
                </p>
              </div>

              {/* Quick Facts Section */}
              <section id="quick-facts" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  Quick Facts: The Big Picture
                </h2>
                <p className="text-neutral-500 mb-6">
                  Use this section as a fast reference or overview in your own content.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <StatCard
                    value="40,901"
                    label="Traffic fatalities in 2023"
                    description="Down 4.3% from 2022"
                    trend="down"
                    trendValue="4.3%"
                    source="NHTSA CrashStats"
                    sourceUrl="https://crashstats.nhtsa.dot.gov/Api/Public/Publication/813705"
                  />
                  <StatCard
                    value="2.44M"
                    label="People injured in 2023"
                    description="2.5% increase from 2022"
                    trend="up"
                    trendValue="2.5%"
                    source="NHTSA CrashStats"
                    sourceUrl="https://crashstats.nhtsa.dot.gov/Api/Public/Publication/813705"
                  />
                  <StatCard
                    value="6.1M"
                    label="Police-reported crashes"
                    description="Total crash volume in 2023"
                    source="ROSA P"
                    sourceUrl="https://rosap.ntl.bts.gov/view/dot/87530"
                  />
                  <StatCard
                    value="$1.37T"
                    label="Economic cost to society"
                    description="Including medical costs, lost productivity, and quality of life losses"
                    source="NHTSA"
                    sourceUrl="https://www.nhtsa.gov/press-releases/traffic-crashes-cost-america-billions-2019"
                  />
                </div>

                <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-8">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Who Dies in Crashes (2023)</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Passenger vehicle occupants", value: 59 },
                      { label: "Pedestrians", value: 18 },
                      { label: "Motorcyclists", value: 15 },
                      { label: "Bicyclists", value: 3 },
                      { label: "Large truck occupants", value: 2 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-neutral-600">{item.label}</span>
                            <span className="text-sm font-medium text-neutral-900">{item.value}%</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2A7D6E] rounded-full"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-400 mt-4">
                    Source: <a href="https://www.iihs.org/research-areas/fatality-statistics/detail/yearly-snapshot" target="_blank" rel="noopener noreferrer" className="text-[#2A7D6E] hover:underline">IIHS Fatality Facts 2023</a>
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Major Contributing Factors (2023)</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-red-600 text-xs font-medium">30%</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Alcohol-impaired driving (BAC 0.08+)</p>
                        <p className="text-sm text-neutral-500">12,429 deaths</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-orange-600 text-xs font-medium">29%</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Speeding-related crashes</p>
                        <p className="text-sm text-neutral-500">11,775 deaths</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-amber-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-amber-600 text-xs font-medium">49%</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Unbelted passenger vehicle occupants killed</p>
                        <p className="text-sm text-neutral-500">Nearly half were not wearing seat belts</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-yellow-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-yellow-600 text-xs font-medium">8%</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Distraction-affected crashes</p>
                        <p className="text-sm text-neutral-500">3,275 deaths; 324,819 injuries</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#FEF3C7] rounded-xl p-5 mt-8 border border-[#FCD34D]">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#B45309] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                    </svg>
                    <p className="text-sm text-[#92400E] leading-relaxed">
                      <strong>International comparison:</strong> Despite recent improvements, United States roads remain
                      significantly more dangerous than those in many peer high-income countries, with population-based
                      death rates more than twice the average of comparable nations.{" "}
                      <a href="https://www.cdc.gov/mmwr/volumes/71/wr/mm7126a1.htm" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">(CDC)</a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 1: How Big is the Problem */}
              <section id="how-big" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  1. How Big is the Vehicle Accident Problem in the United States?
                </h2>

                <h3 className="text-lg font-medium text-neutral-900 mb-4">1.1 Deaths, Injuries, and Trends</h3>
                <p className="text-neutral-600 leading-relaxed mb-6">Recent federal data paint this picture:</p>

                <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[#2A7D6E] font-medium">2022:</span>
                      <span className="text-neutral-600">Almost 44,000 people died in motor vehicle crashes and more than 2.6 million people visited emergency departments for crash injuries. Crash deaths in 2022 alone were estimated to cost over $470 billion.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#2A7D6E] font-medium">2023:</span>
                      <span className="text-neutral-600">40,901 people killed and about 2.44 million injured in an estimated 6.1 million police-reported crashes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#2A7D6E] font-medium">2024 (preliminary):</span>
                      <span className="text-neutral-600">About 39,345 traffic deaths, down 3.8 percent from 2023, with the fatality rate dropping to about 1.20 deaths per 100 million vehicle miles traveled.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#2A7D6E] font-medium">First half of 2025:</span>
                      <span className="text-neutral-600">17,140 deaths, an 8.2 percent decline from the same period in 2024 and the lowest first-half toll since 2020.</span>
                    </li>
                  </ul>
                </div>

                <p className="text-neutral-600 leading-relaxed mb-6">
                  So while the trend since the pandemic-era spike is moving in the right direction, the current baseline remains:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-neutral-600 mb-8">
                  <li>Higher than before the pandemic in 2019</li>
                  <li>High compared with other high-income countries</li>
                </ul>

                <h3 className="text-lg font-medium text-neutral-900 mb-4">1.2 Risk Per Mile Driven</h3>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  To adjust for how much people drive, safety agencies track deaths per 100 million vehicle miles traveled (VMT):
                </p>
                <div className="bg-[#F7F7F7] rounded-xl p-6 mb-6">
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-neutral-600">2022</span>
                      <span className="font-medium text-neutral-900">~1.34 deaths per 100M VMT</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-neutral-600">2023</span>
                      <span className="font-medium text-neutral-900">~1.26 deaths per 100M VMT</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-neutral-600">2024 (estimate)</span>
                      <span className="font-medium text-neutral-900">~1.20 deaths per 100M VMT</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 2: Who is Most at Risk */}
              <section id="who-at-risk" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  2. Who is Most at Risk in Crashes?
                </h2>

                <h3 className="text-lg font-medium text-neutral-900 mb-4">2.1 By Road User Type</h3>

                <div className="space-y-6 mb-8">
                  {/* Pedestrians */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#E8F5F2] rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-neutral-900">Pedestrians</h4>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• <strong>7,314 pedestrians killed</strong> in 2023</li>
                      <li>• Pedestrian deaths made up <strong>18 percent</strong> of all crash deaths</li>
                      <li>• Deaths have risen about <strong>78 percent since 2009</strong></li>
                      <li>• 62% of deaths occurred on major roads (not interstates/freeways)</li>
                    </ul>
                  </div>

                  {/* Motorcyclists */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#E8F5F2] rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-neutral-900">Motorcyclists</h4>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• <strong>6,335 motorcyclists killed</strong> in 2023 (highest since 1975)</li>
                      <li>• Accounted for about <strong>15 percent</strong> of all crash deaths</li>
                      <li>• Per mile traveled, fatality rates were <strong>28x higher</strong> than car occupants</li>
                    </ul>
                  </div>

                  {/* Bicyclists */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#E8F5F2] rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-neutral-900">Bicyclists</h4>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• <strong>~1,166 bicyclists killed</strong> in 2023 (highest since at least 1980)</li>
                      <li>• Nearly <strong>50,000 injuries</strong></li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-neutral-900 mb-4">2.2 By Age</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h4 className="font-medium text-neutral-900 mb-3">Teenagers (13-19)</h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      3,048 teenagers killed in 2023, about two-thirds male. Motor vehicle crashes are a
                      leading cause of death for US teens.
                    </p>
                    <p className="text-xs text-[#2A7D6E] font-medium">
                      Teen crash risk at night is ~3x that of adults per mile driven
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h4 className="font-medium text-neutral-900 mb-3">Older Adults (65+)</h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      7,891 people 65+ killed in 2023 (19% of all fatalities). In 2022, about 25 older
                      adults were killed and 740+ injured every day.
                    </p>
                    <p className="text-xs text-neutral-500">
                      Source: CDC, NHTSA TRID
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Where and When */}
              <section id="where-when" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  3. Where and When Do Serious Crashes Happen?
                </h2>

                <h3 className="text-lg font-medium text-neutral-900 mb-4">3.1 Urban versus Rural</h3>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Although only about one-fifth of the US population lives in rural areas, rural roads remain disproportionately deadly. In 2023:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-neutral-100 p-5 text-center">
                    <p className="text-3xl font-medium text-neutral-900 mb-1">41%</p>
                    <p className="text-sm text-neutral-500">Rural fatalities (16,656 deaths)</p>
                  </div>
                  <div className="bg-white rounded-xl border border-neutral-100 p-5 text-center">
                    <p className="text-3xl font-medium text-neutral-900 mb-1">58%</p>
                    <p className="text-sm text-neutral-500">Urban fatalities (23,921 deaths)</p>
                  </div>
                </div>

                <div className="bg-[#E8F5F2] rounded-xl p-5 mb-8">
                  <p className="text-sm text-[#1E6B5C]">
                    <strong>Key insight:</strong> Only about 31% of vehicle miles traveled were on rural roads,
                    yet they account for 41% of fatalities. Rural roads often feature higher speeds, longer
                    emergency response times, and more run-off-road crashes.
                  </p>
                </div>

                <h3 className="text-lg font-medium text-neutral-900 mb-4">3.2 Time of Day and Day of Week</h3>
                <ul className="space-y-3 text-neutral-600 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                      </svg>
                    </div>
                    <span>Between 9 PM and 6 AM, about <strong>51%</strong> of fatally injured drivers had BAC ≥0.08</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span>On weekends, <strong>42%</strong> of fatally injured drivers had BAC ≥0.08</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                    </div>
                    <span>For teens, <strong>44%</strong> of crash deaths occurred between 9 PM and 6 AM</span>
                  </li>
                </ul>
              </section>

              {/* Section 4: Leading Causes */}
              <section id="leading-causes" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  4. Leading Causes and Risk Factors in US Crashes
                </h2>

                <div className="space-y-8">
                  {/* Speeding */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">4.1 Speeding</h3>
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
                      <div className="text-center">
                        <p className="text-3xl font-medium text-red-600">11,775</p>
                        <p className="text-xs text-neutral-500">Deaths</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-medium text-neutral-900">29%</p>
                        <p className="text-xs text-neutral-500">Of all fatalities</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-medium text-neutral-900">332,598</p>
                        <p className="text-xs text-neutral-500">Injured</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">Common patterns include:</p>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      <li>• High speeds on rural two-lane roads with trees, ditches, or fixed objects</li>
                      <li>• Aggressive driving, such as weaving through traffic or tailgating</li>
                      <li>• Losing control on curves or in poor weather</li>
                    </ul>
                  </div>

                  {/* Alcohol */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">4.2 Alcohol-Impaired Driving</h3>
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
                      <div className="text-center">
                        <p className="text-3xl font-medium text-red-600">12,429</p>
                        <p className="text-xs text-neutral-500">Deaths</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-medium text-neutral-900">30%</p>
                        <p className="text-xs text-neutral-500">Of all fatalities</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-medium text-neutral-900">~42 min</p>
                        <p className="text-xs text-neutral-500">One death every</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Roughly one-quarter of all crash deaths could be prevented if alcohol-impaired drivers
                      were kept off the road. Especially common at night, on weekends, and in single-vehicle run-off-road crashes.
                    </p>
                  </div>

                  {/* Seat Belts */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">4.3 Seat Belt and Restraint Use</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#E8F5F2] rounded-xl p-4 text-center">
                        <p className="text-3xl font-medium text-[#2A7D6E]">91.9%</p>
                        <p className="text-xs text-[#1E6B5C]">Adults wearing seat belts (record high)</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-medium text-red-600">49%</p>
                        <p className="text-xs text-red-700">Of those killed were unrestrained</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600">
                      A small minority of people who still do not buckle up account for roughly half of all
                      vehicle occupant deaths. Unrestrained occupants are much more likely to be ejected or
                      sustain fatal injuries.
                    </p>
                  </div>

                  {/* Distraction */}
                  <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">4.4 Distracted Driving</h3>
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
                      <div className="text-center">
                        <p className="text-3xl font-medium text-orange-600">3,275</p>
                        <p className="text-xs text-neutral-500">Deaths</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-medium text-neutral-900">324,819</p>
                        <p className="text-xs text-neutral-500">Injured</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-medium text-neutral-900">8%</p>
                        <p className="text-xs text-neutral-500">Of fatal crashes</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">Distracted driving includes:</p>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      <li>• Texting or scrolling</li>
                      <li>• Manual phone use for navigation or music</li>
                      <li>• Eating, grooming, or reaching for objects</li>
                      <li>• Engaging with in-vehicle screens</li>
                    </ul>
                    <p className="text-xs text-neutral-500 mt-3 italic">
                      Note: Because distraction is often under-reported, these numbers likely understate the true impact.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FEF3C7] rounded-xl p-5 mt-8 border border-[#FCD34D]">
                  <p className="text-sm text-[#92400E]">
                    <strong>Important:</strong> These factors often stack. A single crash may involve speed,
                    alcohol, distraction, and lack of seat belt use at the same time. The percentages above
                    are therefore not mutually exclusive.
                  </p>
                </div>
              </section>

              {/* Section 5: Economic Costs */}
              <section id="economic-costs" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  5. Economic and Social Costs of Crashes
                </h2>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Crashes are not only a public health issue, but also a massive economic burden.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <StatCard
                    value="$470B+"
                    label="2022 crash death costs"
                    description="Including medical care and the value of lives lost"
                    source="CDC"
                    sourceUrl="https://www.cdc.gov/transportation-safety/about/index.html"
                  />
                  <StatCard
                    value="$1.37T"
                    label="Total societal harm (2019)"
                    description="Equal to roughly 1.6% of US GDP"
                    source="NHTSA"
                    sourceUrl="https://www.nhtsa.gov/press-releases/traffic-crashes-cost-america-billions-2019"
                  />
                </div>

                <p className="text-neutral-600 leading-relaxed">
                  Most people never see these numbers, but they show up as higher insurance premiums, lost work days
                  and productivity, traffic congestion, and emergency response costs.
                </p>
              </section>

              {/* Section 6: Prevention */}
              <section id="prevention" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  6. Evidence-Based Ways to Reduce Crash Risk
                </h2>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Modern traffic safety uses a <strong>Safe System Approach</strong>. Instead of expecting perfect
                  behavior, the system is designed so that inevitable mistakes do not result in death or serious injury.
                </p>

                <h3 className="text-lg font-medium text-neutral-900 mb-4">6.1 For Individual Drivers and Passengers</h3>
                <div className="space-y-4 mb-8">
                  {[
                    {
                      title: "Always wear a seat belt, every seat, every trip",
                      description: "Buckling up cuts the risk of fatal injury roughly in half for front seat occupants in most crash types.",
                      icon: "🔒"
                    },
                    {
                      title: "Slow down and match speed to conditions",
                      description: "Treat posted speed limits as maximums under good conditions, not targets. Reduce speed in rain, snow, or poor visibility.",
                      icon: "🚗"
                    },
                    {
                      title: "Drive sober and substance-free",
                      description: "Plan a sober ride in advance if you drink or use impairing drugs. Some prescriptions can also impair driving.",
                      icon: "🚫"
                    },
                    {
                      title: "Lock your phone and minimize distraction",
                      description: "Use true hands-free options and set navigation before you start moving. Pull over safely if you need to engage with your device.",
                      icon: "📱"
                    },
                    {
                      title: "Defensive driving basics",
                      description: "Leave at least 3 seconds of following distance. Actively scan for pedestrians, cyclists, and motorcycles, especially when turning.",
                      icon: "👁️"
                    },
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-xl border border-neutral-100 p-5 flex items-start gap-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-neutral-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-medium text-neutral-900 mb-4">6.2 For Parents and Caregivers of Teen Drivers</h3>
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-8">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#E8F5F2] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-[#2A7D6E] text-xs font-medium">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Graduated rules stricter than state minimums</p>
                        <p className="text-sm text-neutral-500">Limit night driving (especially after 9-10 PM), restrict teen passengers, zero alcohol/drug tolerance</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#E8F5F2] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-[#2A7D6E] text-xs font-medium">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Extended supervised driving</p>
                        <p className="text-sm text-neutral-500">Practice in varied conditions: rain, freeway, rural, heavy traffic, night. Model calm, attentive driving.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#E8F5F2] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-[#2A7D6E] text-xs font-medium">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">Written parent-teen agreements</p>
                        <p className="text-sm text-neutral-500">Spell out rules, curfews, passenger limits, phone rules, and consequences.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 7: After a Crash */}
              <section id="after-crash" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  7. What to Do Immediately After a Vehicle Crash
                </h2>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  This section offers practical steps for drivers and passengers after a crash. It is informational
                  and not a substitute for professional legal or medical advice.
                </p>

                <div className="space-y-4">
                  {[
                    { step: 1, title: "Check for immediate danger and move to safety if possible", description: "Turn on hazard lights. If safe and drivable, move to the shoulder to avoid secondary crashes." },
                    { step: 2, title: "Call 911", description: "Report injuries, location, and the type of vehicles involved. When in doubt, call." },
                    { step: 3, title: "Check for injuries", description: "Do not move seriously injured people unless there's an immediate threat (fire, oncoming traffic)." },
                    { step: 4, title: "Prevent further crashes", description: "Use hazard lights, flares, or reflective triangles if available and safe to deploy." },
                    { step: 5, title: "Exchange information", description: "Names, contact details, license numbers, insurance info, vehicle details." },
                    { step: 6, title: "Document the scene", description: "Photos of positions, damage, skid marks, debris, road conditions. Notes about weather and lighting. Witness contacts." },
                    { step: 7, title: "Seek medical evaluation", description: "Some injuries (concussions, internal injuries) may not be obvious immediately." },
                    { step: 8, title: "Contact your insurer promptly", description: "Report the crash according to your policy requirements." },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 bg-white rounded-xl border border-neutral-100 p-5">
                      <div className="w-10 h-10 bg-[#2A7D6E] rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-neutral-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 8: Case Studies */}
              <section id="case-studies" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  8. Case Studies: How Crashes Happen and How They Can Be Prevented
                </h2>
                <p className="text-neutral-500 mb-6 text-sm">
                  These examples are composites based on common patterns in national data, not real individuals.
                </p>

                <div className="space-y-6">
                  {/* Case 1 */}
                  <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                    <div className="bg-neutral-900 px-6 py-4">
                      <h3 className="text-white font-medium">Case Study 1: Late Night Distracted Driving on an Urban Arterial</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-neutral-600 text-sm mb-4">
                        A 22-year-old driver finishes a late shift and starts a 20-minute drive home on a six-lane
                        arterial posted at 45 mph. While scrolling for music, the driver drifts across a faded lane
                        line and sideswipes a parked delivery van at about 40 mph.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-red-800 mb-2">Risk Factors</h4>
                          <p className="text-xs text-red-700">Nighttime, mild fatigue, distraction, high-speed road with roadside hazards</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-orange-800 mb-2">Outcome</h4>
                          <p className="text-xs text-orange-700">Unbelted passenger: serious facial fractures. Belted driver: minor injuries.</p>
                        </div>
                      </div>
                      <div className="bg-[#E8F5F2] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#1E6B5C] mb-2">What Could Have Changed Things</h4>
                        <ul className="text-xs text-[#1E6B5C] space-y-1">
                          <li>• Set navigation and music before starting; use voice controls</li>
                          <li>• City redesigns arterial with better lighting, rumble stripes, lower speed limit</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Case 2 */}
                  <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                    <div className="bg-neutral-900 px-6 py-4">
                      <h3 className="text-white font-medium">Case Study 2: Rural Run-Off-Road Crash with No Seat Belt</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-neutral-600 text-sm mb-4">
                        A 45-year-old pickup driver heads home late at night on a rural two-lane road posted at 55 mph.
                        Light drizzle, minimal lighting, shallow ditch next to pavement. Traveling at 65 mph, not wearing
                        a seat belt, briefly nods off. Truck drifts off right side, drops into ditch, rolls.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-red-800 mb-2">Risk Factors</h4>
                          <p className="text-xs text-red-700">Rural road, high speed, nighttime, fatigue, no seat belt</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-orange-800 mb-2">Outcome</h4>
                          <p className="text-xs text-orange-700">Single-vehicle fatal rollover crash. Driver partially ejected.</p>
                        </div>
                      </div>
                      <div className="bg-[#E8F5F2] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#1E6B5C] mb-2">What Could Have Changed Things</h4>
                        <ul className="text-xs text-[#1E6B5C] space-y-1">
                          <li>• Cut speed to limit or below; wear seat belt</li>
                          <li>• Family/employer recognize chronic fatigue signs</li>
                          <li>• Road agency adds rumble strips, wider shoulders, forgiving roadsides</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Case 3 */}
                  <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                    <div className="bg-neutral-900 px-6 py-4">
                      <h3 className="text-white font-medium">Case Study 3: Teen Driver, Multiple Passengers, and Speed</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-neutral-600 text-sm mb-4">
                        A 17-year-old newly licensed driver takes three friends to a party. On the way back before midnight,
                        friends encourage the driver to race for a green light. Driver accelerates to 70 mph in a 45 mph zone,
                        misjudges a curve, loses control, strikes a utility pole.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-red-800 mb-2">Risk Factors</h4>
                          <p className="text-xs text-red-700">Teen driver, teen passengers, late night, high speed, distraction, limited experience</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-orange-800 mb-2">Outcome</h4>
                          <p className="text-xs text-orange-700">Serious injuries for two rear seat passengers who were not wearing seat belts.</p>
                        </div>
                      </div>
                      <div className="bg-[#E8F5F2] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#1E6B5C] mb-2">What Could Have Changed Things</h4>
                        <ul className="text-xs text-[#1E6B5C] space-y-1">
                          <li>• Parents enforce no teen passengers/no driving after 10 PM for first year</li>
                          <li>• Teen declines to drive others until more experience; insists everyone buckle up</li>
                          <li>• City applies traffic calming design to discourage high speeds</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 9: Data Sources */}
              <section id="data-sources" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  9. Key Data Sources You Can Cite
                </h2>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  If you are writing about crash trends, these are the primary sources behind the numbers on this page:
                </p>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-neutral-100 p-5">
                    <h4 className="font-medium text-neutral-900 mb-2">NHTSA Fatality Analysis Reporting System (FARS)</h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      CrashStats summaries for 2023 data including overview, speeding, alcohol-impaired driving, rural vs urban, occupant protection, motorcycles, older population.
                    </p>
                    <a href="https://crashstats.nhtsa.dot.gov/Api/Public/Publication/813705" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2A7D6E] hover:underline">
                      View CrashStats →
                    </a>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-100 p-5">
                    <h4 className="font-medium text-neutral-900 mb-2">Centers for Disease Control and Prevention (CDC)</h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      Transportation safety overviews and cost estimates. Teen driver and older adult driver risk factor pages.
                    </p>
                    <a href="https://www.cdc.gov/transportation-safety/about/index.html" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2A7D6E] hover:underline">
                      View CDC Data →
                    </a>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-100 p-5">
                    <h4 className="font-medium text-neutral-900 mb-2">Insurance Institute for Highway Safety (IIHS)</h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      Fatality Facts series with yearly snapshots, pedestrians, motorcycles, teenagers, state-by-state summaries.
                    </p>
                    <a href="https://www.iihs.org/research-areas/fatality-statistics/detail/yearly-snapshot" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2A7D6E] hover:underline">
                      View IIHS Facts →
                    </a>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-100 p-5">
                    <h4 className="font-medium text-neutral-900 mb-2">US Department of Transportation and FHWA</h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      Safe System policy and rural road safety guidance.
                    </p>
                    <a href="https://www.transportation.gov/safe-system-approach" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2A7D6E] hover:underline">
                      View Safe System Approach →
                    </a>
                  </div>
                </div>

                <div className="bg-[#F7F7F7] rounded-xl p-5 mt-6">
                  <p className="text-sm text-neutral-600">
                    <strong>Citation example:</strong> &quot;Data summarized from federal sources including NHTSA&apos;s Fatality
                    Analysis Reporting System (FARS), CDC transportation safety statistics, and IIHS Fatality Facts (latest 2023 data).&quot;
                  </p>
                </div>
              </section>

              {/* Section 10: FAQ */}
              <section id="faq" className="mb-16 scroll-mt-28">
                <h2 className="text-2xl font-medium text-neutral-900 mb-6 tracking-tight">
                  10. Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h3 className="font-medium text-neutral-900 mb-3">
                      How many people die in United States car crashes each year?
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Recent data show: 2022: almost 44,000 motor vehicle crash deaths; 2023: 40,901 deaths;
                      2024 (preliminary): about 39,345 deaths. That is still more than 100 people killed in
                      crashes every single day.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h3 className="font-medium text-neutral-900 mb-3">
                      Are United States roads getting safer?
                    </h3>
                    <p className="text-sm text-neutral-600">
                      In the short term, yes. Fatalities and fatality rates have declined modestly from pandemic-era
                      peaks, and early 2025 data show continued improvement. In the longer term, though, deaths
                      remain substantially higher than a decade ago and significantly higher than in comparable
                      high-income countries.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h3 className="font-medium text-neutral-900 mb-3">
                      What are the top causes of fatal crashes?
                    </h3>
                    <p className="text-sm text-neutral-600">
                      The big four risk factors are: Speeding, Alcohol-impaired driving, Failure to wear seat
                      belts or use child restraints, and Distracted driving.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-100 p-6">
                    <h3 className="font-medium text-neutral-900 mb-3">
                      Who is at highest risk?
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Risk is elevated for: Teen drivers and their passengers, Motorcyclists, Pedestrians
                      (especially along high-speed multi-lane roads), and Older adults who are more physically
                      fragile in crashes.
                    </p>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-neutral-900 rounded-2xl p-8 lg:p-10">
                <h2 className="text-2xl font-medium text-white mb-4 tracking-tight">
                  Were You Involved in an Accident?
                </h2>
                <p className="text-neutral-300 mb-6 leading-relaxed">
                  If you or a loved one has been injured in a vehicle crash, understanding your options is
                  important. We can help connect you with experienced personal injury attorneys for a free,
                  no-obligation case review.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/legal-help"
                    className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#236859] transition-all"
                  >
                    Get Free Case Review
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center bg-transparent text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-all border border-neutral-700"
                  >
                    Search Accident Records
                  </Link>
                </div>
              </section>
            </article>

            {/* Sidebar TOC */}
            <aside className="hidden xl:block w-72 flex-shrink-0">
              <TableOfContents items={tocItems} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
