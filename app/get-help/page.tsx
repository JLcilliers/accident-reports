import type { Metadata } from "next";
import { AccidentOnboardingWizard } from "@/components/AccidentOnboardingWizard";

export const metadata: Metadata = {
  title: "Find Your Accident Report | Free Search",
  description:
    "Search our database of accident reports to find information about your incident. Get connected with resources and legal help if needed.",
  openGraph: {
    title: "Find Your Accident Report | Free Search",
    description:
      "Search our database of accident reports to find information about your incident. Get connected with resources and legal help if needed.",
  },
};

export default function GetHelpPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <a href="/" className="text-xl font-bold text-black">
            Accident Reports
          </a>
        </div>
      </div>

      {/* Wizard */}
      <div className="py-12 px-4">
        <AccidentOnboardingWizard />
      </div>

      {/* Trust indicators */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Your information is secure and confidential
          </p>
          <div className="flex justify-center items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm">Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-sm">Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">Fast Response</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
