import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import CTABox from "@/components/CTABox";

// Sample states for demonstration
const stateData: Record<string, { name: string; info: string }> = {
  colorado: {
    name: "Colorado",
    info: "In Colorado, accident reports are typically available within 7-10 business days after the incident. The Colorado Department of Transportation and local police departments maintain these records.",
  },
  texas: {
    name: "Texas",
    info: "Texas accident reports are managed by the Texas Department of Transportation. Reports are usually available within 10-14 business days and can be obtained from the investigating law enforcement agency.",
  },
  florida: {
    name: "Florida",
    info: "Florida law requires accident reports for crashes involving injuries, deaths, or property damage over $500. The Florida Highway Safety and Motor Vehicles provides access to crash reports.",
  },
};

export async function generateStaticParams() {
  return Object.keys(stateData).map((slug) => ({
    stateSlug: slug,
  }));
}

export default async function StateAccidentReportsPage({
  params,
}: {
  params: Promise<{ stateSlug: string }>;
}) {
  const { stateSlug } = await params;
  const state = stateData[stateSlug];

  if (!state) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {state.name} Accident & Police Reports – Free Online Lookup
          </h1>
          <p className="text-xl text-gray-600">
            Get your {state.name} accident report quickly and easily - completely free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Overview Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">How to Get Your {state.name} Accident Report</h2>
              <p className="text-gray-700 mb-4">{state.info}</p>
              <p className="text-gray-700 mb-6">
                We simplify the process by searching multiple databases and delivering your
                report directly to you at no cost.
              </p>
              <Link
                href={`/get-report/step-1?state=${state.name}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Find My {state.name} Accident Report
              </Link>
            </div>

            {/* Process Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">What You'll Need</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Date and approximate time of the accident</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Location (city or county) where the accident occurred</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Type of accident (car, truck, motorcycle, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Police department that responded (if known)</span>
                </li>
              </ul>
            </div>

            {/* Timeline Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Typical Timeline for {state.name} Reports</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold">Immediately After Accident</h3>
                  <p className="text-gray-600">Police file initial report at the scene</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h3 className="font-semibold">1-2 Weeks</h3>
                  <p className="text-gray-600">Report processed and entered into database</p>
                </div>
                <div className="border-l-4 border-blue-200 pl-4">
                  <h3 className="font-semibold">Within 24-48 Hours</h3>
                  <p className="text-gray-600">
                    We locate and deliver your report after you submit your request
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">
                Frequently Asked Questions About {state.name} Accident Reports
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    How long does it take to get my {state.name} accident report?
                  </h3>
                  <p className="text-gray-600">
                    Most reports are available within 24-48 hours after you submit your request.
                    Some reports may take longer if they're still being processed by the police
                    department.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Is this service really free?</h3>
                  <p className="text-gray-600">
                    Yes! We provide accident reports at absolutely no cost. There are no hidden
                    fees or subscription charges.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    What if I was injured in the accident?
                  </h3>
                  <p className="text-gray-600">
                    If you were injured, you may be entitled to compensation. We can connect you
                    with experienced personal injury attorneys for a free case review.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Can I use this report for insurance claims?
                  </h3>
                  <p className="text-gray-600">
                    Yes, the report we provide can be used for insurance purposes. For legal
                    proceedings, you may need a certified copy from the police department.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-4 space-y-6">
              <CTABox
                title="Get Your Report Now"
                description={`Find your ${state.name} accident report in minutes - completely free with no obligation.`}
                buttonText={`Find My ${state.name} Report`}
                buttonHref={`/get-report/step-1?state=${state.name}`}
              />

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold mb-4">Why Use Our Service?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>100% Free - No hidden costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Fast - Reports in 24-48 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Easy - Simple online process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Secure - Your data is protected</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
