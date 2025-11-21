import { notFound } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import CTABox from "@/components/CTABox";
import { mockReports } from "@/lib/mockData";

export async function generateStaticParams() {
  return mockReports.map((report) => ({
    reportId: report.id,
  }));
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const report = mockReports.find((r) => r.id === reportId);

  if (!report) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto py-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Accident Report</h1>
          <p className="text-blue-100 text-lg">Report ID: {report.id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Report Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Report Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Date of Incident</p>
                  <p className="font-semibold">
                    {new Date(report.accidentDetails.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {report.accidentDetails.time && (
                    <p className="text-sm text-gray-600">
                      at {report.accidentDetails.time}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-semibold">
                    {report.accidentDetails.city}, {report.accidentDetails.state}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Incident Type</p>
                  <p className="font-semibold">{report.accidentDetails.incidentType}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Report Status</p>
                  <p className="font-semibold capitalize">{report.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Vehicles Involved</p>
                  <p className="font-semibold">{report.vehiclesInvolved}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Injuries Reported</p>
                  <p className="font-semibold">{report.injuriesReported ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            {/* Police Department Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Police Department</h2>
              <p className="text-lg font-semibold">{report.policeDept}</p>
              {report.accidentDetails.policeDepartment && (
                <p className="text-gray-600">
                  This report was filed with {report.accidentDetails.policeDepartment}
                </p>
              )}
            </div>

            {/* Download Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <svg
                  className="w-12 h-12 text-blue-600 mr-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Download Your Report</h3>
                  <p className="text-gray-700 mb-4">
                    {report.status === "full"
                      ? "Download the complete certified accident report as a PDF document."
                      : "A summary of your accident report is available. The full certified copy may be available soon."}
                  </p>
                  {report.downloadUrl ? (
                    <a
                      href={report.downloadUrl}
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      download
                    >
                      Download PDF (Free)
                    </a>
                  ) : (
                    <p className="text-gray-600 italic">
                      Download will be available once the full report is processed
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">📋 Important Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    This report is provided for informational purposes. For legal proceedings,
                    you may need a certified copy from the police department.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Keep this report for your insurance claim and any legal proceedings.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    If you were injured, time is critical. Speak with an attorney as soon as
                    possible to protect your rights.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar with CTA */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <CTABox
                title="Were You Injured?"
                description="If you or someone you love was injured in this accident, you may be entitled to compensation for medical bills, lost wages, and pain and suffering."
                buttonText="Get Free Legal Consultation"
                buttonHref={`/legal-help?reportId=${report.id}`}
              />

              {/* Additional Info Box */}
              <div className="bg-gray-50 rounded-lg p-6 mt-6">
                <h3 className="font-bold mb-3">Why Talk to a Lawyer?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Preserve evidence and witness statements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Meet important legal deadlines</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Get maximum compensation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>No fees unless we win</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Another Report?</h2>
          <p className="text-xl mb-6 text-blue-100">
            We can help you find any accident or police report - 100% free
          </p>
          <Link
            href="/get-report/step-1"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Find Another Report
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
