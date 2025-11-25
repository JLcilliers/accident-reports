import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "1",
      title: "Enter Your Info",
      description: "Provide basic accident details like the date, location, and type of incident. Our simple form takes less than 2 minutes to complete.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      number: "2",
      title: "We Search",
      description: "Our AI-powered system searches multiple databases, police departments, and public records to locate your accident report.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: "3",
      title: "Get Your Report",
      description: "Receive your accident report for free. Download it instantly or get it delivered to your email - no fees, no hassle.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">How It Works</h1>
        <p className="text-lg text-[#A5B1C5] leading-relaxed max-w-2xl mx-auto">
          Getting your accident report has never been easier. Follow these three simple steps to access your report for free.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:bg-[#B6FF2C] hover:transform hover:-translate-y-[10px] hover:shadow-[0_22px_45px_rgba(182,255,44,0.55)] hover:border-transparent text-center relative"
          >
            {/* Step Number Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#B6FF2C] rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#05070B] transition-colors duration-[220ms]">
              <span className="text-lg font-bold text-[#05070B] group-hover:text-[#B6FF2C] transition-colors duration-[220ms]">
                {step.number}
              </span>
            </div>

            {/* Icon */}
            <div className="w-16 h-16 bg-[#05070B] rounded-lg flex items-center justify-center mx-auto mb-4 mt-4 group-hover:bg-white/20 transition-colors duration-[220ms]">
              <div className="text-[#B6FF2C] group-hover:text-[#05070B] transition-colors duration-[220ms]">
                {step.icon}
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#05070B] transition-colors duration-[220ms]">
              {step.title}
            </h2>
            <p className="text-[#A5B1C5] leading-relaxed group-hover:text-[#05070B] transition-colors duration-[220ms]">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Connecting Line (Desktop) */}
      <div className="hidden md:block relative -mt-[200px] mb-[120px]">
        <div className="absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#1C2430] via-[#B6FF2C] to-[#1C2430] opacity-30"></div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow">
              <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Fast Results</h3>
              <p className="text-[#A5B1C5] leading-relaxed">
                Most reports are found within minutes. If manual lookup is required, we'll have your report within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-[#B6FF2C] rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow">
              <svg className="w-6 h-6 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">100% Free</h3>
              <p className="text-[#A5B1C5] leading-relaxed">
                No hidden fees, no credit card required. We believe everyone deserves access to their accident reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-[#A5B1C5] mb-6 leading-relaxed">
          It only takes 2 minutes to request your free accident report
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
    </PageContainer>
  );
}
