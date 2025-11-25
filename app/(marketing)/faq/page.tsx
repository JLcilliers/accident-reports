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
      answer: "We search multiple public databases, partner data sources, and official records to locate your accident report. Our system cross-references information to find the most accurate match.",
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
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-neutral-500 leading-relaxed">
          Find answers to common questions about getting your accident report
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            <h2 className="text-lg font-medium text-neutral-900 mb-3">{faq.question}</h2>
            <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-neutral-900 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-medium text-white mb-4">Still Have Questions?</h2>
        <p className="text-lg text-neutral-400 mb-6 leading-relaxed">
          Get started now and we'll help you every step of the way
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
          >
            Search Accident Records
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all border border-neutral-700"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
