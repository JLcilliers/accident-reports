import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function FAQPage() {
  const faqs = [
    {
      question: "Is this service free?",
      answer: "Yes, absolutely! We provide accident reports at no cost to you. There are no hidden fees, no subscription charges, and we never ask for credit card information.",
    },
    {
      question: "Where do you get your data?",
      answer: "We search multiple public databases, partner data sources, and official records to locate your accident report. Our AI-powered system cross-references information to find the most accurate match.",
    },
    {
      question: "How long does it take to get a report?",
      answer: "Most accident reports are found within minutes using our automated system. If manual lookup is required, it typically takes 24-48 hours. We'll notify you via email or SMS when your report is ready.",
    },
    {
      question: "Will a lawyer contact me?",
      answer: "Only if you were injured and qualify for legal assistance. If you indicate you were injured, we may connect you with experienced personal injury attorneys for a free case review. This is entirely optional and you can decline at any time.",
    },
    {
      question: "What information do I need to get my report?",
      answer: "You'll need basic details about the accident: the date it occurred, the location (city/county and state), and the type of incident. The more details you provide, the faster we can locate your report.",
    },
    {
      question: "What if my accident report isn't found?",
      answer: "If our automated system can't find your report, we'll queue it for manual lookup by our team. Reports are typically available 5-14 days after an accident. We'll notify you as soon as it becomes available.",
    },
    {
      question: "Can I use this report for insurance claims?",
      answer: "Yes, the report we provide can be used for insurance purposes and documentation. For legal proceedings or official court matters, you may need a certified copy directly from the police department.",
    },
    {
      question: "What states do you cover?",
      answer: "We currently provide accident report lookup services for all 50 states. Our system searches multiple databases to locate reports from local police departments, state highway patrols, and other law enforcement agencies nationwide.",
    },
    {
      question: "Is my information secure?",
      answer: "Yes, we take data security seriously. All information you provide is encrypted and stored securely. We never sell your information to third parties. Your data is only used to locate your accident report.",
    },
    {
      question: "How do I know if I need a lawyer?",
      answer: "Consider talking to a lawyer if: you suffered injuries requiring medical treatment, you missed work due to the accident, the other party was at fault, or insurance companies are offering low settlements. A free consultation can help you understand your options.",
    },
  ];

  return (
    <PageContainer>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-[#A5B1C5] leading-relaxed">
          Find answers to common questions about getting your accident report
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="group bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-[220ms] ease-out hover:bg-[#B6FF2C] hover:transform hover:-translate-y-[4px] hover:shadow-[0_22px_45px_rgba(182,255,44,0.55)] hover:border-transparent"
          >
            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#05070B] transition-colors duration-[220ms]">{faq.question}</h2>
            <p className="text-[#A5B1C5] leading-relaxed group-hover:text-[#05070B] transition-colors duration-[220ms]">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)] text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
        <p className="text-lg text-[#A5B1C5] mb-6 leading-relaxed">
          Get started now and we'll help you every step of the way
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/get-report/step-1"
            className="inline-flex items-center justify-center bg-[#B6FF2C] text-[#05070B] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#8EE522] transition-all shadow-lg hover:shadow-[0_0_18px_rgba(182,255,44,0.35)]"
          >
            Find My Accident Report
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-transparent text-[#B6FF2C] px-7 py-3.5 rounded-lg font-semibold text-base hover:bg-[#B6FF2C]/10 transition-all border border-[#8EE522]"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
