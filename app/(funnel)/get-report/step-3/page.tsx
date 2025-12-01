"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import StepIndicator from "@/components/StepIndicator";
import CTABox from "@/components/CTABox";
import { Report } from "@/lib/types";

export default function Step3Page() {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasReport, setHasReport] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      // Check if we have a matched report ID
      const matchedReportId = sessionStorage.getItem("matchedReportId");
      const requestId = sessionStorage.getItem("requestId");

      if (!requestId) {
        // Redirect back to step 1 if no request ID
        router.push("/get-report/step-1");
        return;
      }

      if (matchedReportId) {
        try {
          const response = await fetch(`/api/reports/${matchedReportId}`);
          const data = await response.json();

          if (response.ok && data.report) {
            setReport(data.report);
            setHasReport(true);
          }
        } catch (error) {
          console.error("Error fetching report:", error);
        }
      }

      setLoading(false);
    };

    fetchReport();
  }, [router]);

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-8">
        <StepIndicator currentStep={3} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 md:p-8">
              {hasReport && report ? (
                <>
                  <div className="flex items-center mb-6">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-green-600">Report Found!</h1>
                      <p className="text-gray-600">We located your accident report</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Report Details</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Report ID:</span>
                        <span className="font-semibold">{report.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">
                          {new Date(report.accidentDetails.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-semibold">
                          {report.accidentDetails.city}, {report.accidentDetails.state}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-semibold">{report.accidentDetails.incidentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicles Involved:</span>
                        <span className="font-semibold">{report.vehiclesInvolved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Police Department:</span>
                        <span className="font-semibold">{report.policeDept}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold capitalize">{report.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/reports/${report.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      View Full Report
                    </Link>
                    {report.downloadUrl && (
                      <a
                        href={report.downloadUrl}
                        className="flex-1 bg-green-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
                        download
                      >
                        Download PDF
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <svg
                        className="w-8 h-8 text-blue-600 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-blue-600">Searching for Your Report</h1>
                      <p className="text-gray-600">We're locating your accident report</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-3">What's Happening Now?</h2>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">
                          We're searching official databases for your accident report
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">
                          You'll receive an email as soon as we locate it
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">
                          We'll check our news sources for matching incidents
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-gray-600 text-center">
                    We'll send you an email with your report as soon as it's available.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <CTABox
              buttonHref={`/legal-help${hasReport && report ? `?reportId=${report.id}` : ""}`}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
