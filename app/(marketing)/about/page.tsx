import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">About AI First Accident Reports</h1>
        <p className="text-lg text-[#A5B1C5] leading-relaxed">
          We're dedicated to helping accident victims access the information they need - for free.
        </p>
      </div>

      <div className="space-y-6">
        {/* Mission */}
        <div className="group bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-[#A5B1C5] mb-4 leading-relaxed">
            Getting an accident report shouldn't be complicated or expensive. That's why we created
            AI First Accident Reports - to provide free, fast, and easy access to accident and police
            reports using AI + automation.
          </p>
          <p className="text-[#A5B1C5] leading-relaxed">
            Whether you need a report for insurance claims, legal proceedings, or personal records,
            we're here to help you get it without the hassle of dealing with government offices
            or paying expensive fees.
          </p>
        </div>

        {/* How We Help */}
        <div className="group bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl font-bold text-white mb-4">How We Help</h2>
          <p className="text-[#A5B1C5] mb-6 leading-relaxed">
            We've built a comprehensive AI-powered system that searches multiple databases to locate accident
            reports quickly. Instead of you having to contact various police departments, navigate
            complex government websites, or wait in long lines, we do the work for you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B6FF2C] rounded-lg flex items-center justify-center mx-auto mb-3 shadow">
                <span className="text-2xl font-bold text-[#05070B]">1</span>
              </div>
              <h3 className="font-bold text-white mb-2">You Provide Details</h3>
              <p className="text-sm text-[#A5B1C5]">
                Simple form with basic accident information
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B6FF2C] rounded-lg flex items-center justify-center mx-auto mb-3 shadow">
                <span className="text-2xl font-bold text-[#05070B]">2</span>
              </div>
              <h3 className="font-bold text-white mb-2">We Search</h3>
              <p className="text-sm text-[#A5B1C5]">
                AI locates your report across multiple databases
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B6FF2C] rounded-lg flex items-center justify-center mx-auto mb-3 shadow">
                <span className="text-2xl font-bold text-[#05070B]">3</span>
              </div>
              <h3 className="font-bold text-white mb-2">You Receive</h3>
              <p className="text-sm text-[#A5B1C5]">
                Free access to your report summary and instructions
              </p>
            </div>
          </div>
        </div>

        {/* Why Free */}
        <div className="group bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl font-bold text-white mb-4">Why Is It Free?</h2>
          <p className="text-[#A5B1C5] mb-4 leading-relaxed">
            We believe everyone deserves access to their accident reports without financial barriers.
            Our service is free because we're supported by partnerships with legal professionals who
            help accident victims get the compensation they deserve.
          </p>
          <p className="text-[#A5B1C5] leading-relaxed">
            If you were injured in an accident, we can optionally connect you with experienced
            personal injury attorneys for a free case review. There's no obligation - you're free
            to just get your report and move on. But if you need legal help, we're here for that too.
          </p>
        </div>

        {/* Values */}
        <div className="group bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:shadow-[0_16px_32px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl font-bold text-white mb-6">Our Values</h2>
          <div className="space-y-5">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow">
                <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Transparency</h3>
                <p className="text-[#A5B1C5]">
                  No hidden fees, no surprises. What we say is what you get - free accident reports.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow">
                <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Privacy & Security</h3>
                <p className="text-[#A5B1C5]">
                  Your information is protected with industry-standard encryption and never sold to third parties.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow">
                <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Speed & Efficiency</h3>
                <p className="text-[#A5B1C5]">
                  AI-powered automation means faster results. Get your report in minutes, not days.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow">
                <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Compassion</h3>
                <p className="text-[#A5B1C5]">
                  We understand that dealing with an accident is stressful. We're here to make at least one part easier.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-[#A5B1C5] mb-6 leading-relaxed">
            Join thousands of people who've already used our free service
          </p>
          <Link
            href="/get-report/step-1"
            className="inline-flex items-center justify-center bg-[#B6FF2C] text-[#05070B] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#8EE522] transition-all shadow-lg hover:shadow-[0_0_18px_rgba(182,255,44,0.35)]"
          >
            Find My Accident Report
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
