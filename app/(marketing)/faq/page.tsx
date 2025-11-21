import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function FAQPage() {
  const faqs = [
    {
      question: "How long does it take to get my accident report?",
      answer: "Most accident reports are available within 24-48 hours after you submit your request. However, this depends on when the police department processed the report. Some reports may take longer if they're still being processed by law enforcement.",
    },
    {
      question: "Is this service really free?",
      answer: "Yes, absolutely! We provide accident reports at no cost to you. There are no hidden fees, no subscription charges, and we never ask for credit card information.",
    },
    {
      question: "What information do I need to get my report?",
      answer: "You'll need basic details about the accident: the date it occurred, the location (city/county and state), and the type of incident (car accident, motorcycle, etc.). Optional information like police department name or license plate can help us locate your report faster.",
    },
    {
      question: "Do I have to use your lawyers?",
      answer: "No, absolutely not. Getting your accident report is completely free with no strings attached. We offer free case reviews with experienced attorneys as an optional service if you were injured and want legal assistance.",
    },
    {
      question: "What if my accident report isn't found?",
      answer: "If we can't immediately locate your report, it may still be processing with the police department. We'll notify you via email as soon as the report becomes available. Reports are typically available 5-14 days after an accident.",
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
      answer: "Yes, we take data security seriously. All information you provide is encrypted and stored securely. We never sell your information to third parties. Your data is only used to locate your accident report and provide optional legal assistance if requested.",
    },
    {
      question: "How far back can I search for reports?",
      answer: "You can search for reports from recent accidents as well as older incidents. Most police departments maintain digital records for several years. The availability of older reports depends on the specific jurisdiction and their record-keeping practices.",
    },
    {
      question: "What if I don't remember all the details of the accident?",
      answer: "That's okay! We only need basic information to search for your report. If you remember the approximate date and location, we can usually find your report. The more details you provide, the faster we can locate it.",
    },
    {
      question: "Why should I talk to a lawyer if I was injured?",
      answer: "If you were injured in an accident, you may be entitled to compensation for medical bills, lost wages, pain and suffering, and other damages. Insurance companies often offer low settlements. An experienced attorney can help you get the maximum compensation you deserve. Plus, most personal injury attorneys work on contingency - no fees unless you win.",
    },
    {
      question: "How do I know if I need a lawyer?",
      answer: "Consider talking to a lawyer if: you suffered injuries requiring medical treatment, you missed work due to the accident, the other party was clearly at fault, insurance companies are offering low settlements, or the accident involved significant property damage. A free consultation can help you understand your options.",
    },
  ];

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about getting your accident report
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-3">{faq.question}</h2>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Get started now and we'll help you every step of the way
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-report/step-1"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get My Accident Report
            </Link>
            <Link
              href="/legal-help"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition border-2 border-white"
            >
              Talk to a Lawyer
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
