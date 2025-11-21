import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-5xl font-bold mb-6">About AccidentReports.com</h1>
        <p className="text-xl text-gray-600 mb-12">
          We're dedicated to helping accident victims access the information they need - for free.
        </p>

        <div className="space-y-8">
          {/* Mission */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Getting an accident report shouldn't be complicated or expensive. That's why we created
              AccidentReports.com - to provide free, fast, and easy access to accident and police
              reports for people across the United States.
            </p>
            <p className="text-gray-700">
              Whether you need a report for insurance claims, legal proceedings, or personal records,
              we're here to help you get it without the hassle of dealing with government offices
              or paying expensive fees.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">How We Help</h2>
            <p className="text-gray-700 mb-4">
              We've built a comprehensive system that searches multiple databases to locate accident
              reports quickly. Instead of you having to contact various police departments, navigate
              complex government websites, or wait in long lines, we do the work for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">You Provide Details</h3>
                <p className="text-sm text-gray-600">
                  Simple form with basic accident information
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">We Search</h3>
                <p className="text-sm text-gray-600">
                  Our system locates your report across multiple databases
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">You Receive</h3>
                <p className="text-sm text-gray-600">
                  Free access to your report, typically within 24-48 hours
                </p>
              </div>
            </div>
          </div>

          {/* Why Free */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Why Is It Free?</h2>
            <p className="text-gray-700 mb-4">
              We believe everyone deserves access to their accident reports without financial barriers.
              Our service is free because we're supported by partnerships with legal professionals who
              help accident victims get the compensation they deserve.
            </p>
            <p className="text-gray-700">
              If you were injured in an accident, we can optionally connect you with experienced
              personal injury attorneys for a free case review. There's no obligation - you're free
              to just get your report and move on. But if you need legal help, we're here for that too.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded p-2 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Transparency</h3>
                  <p className="text-gray-600">
                    No hidden fees, no surprises. What we say is what you get - free accident reports.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded p-2 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Privacy & Security</h3>
                  <p className="text-gray-600">
                    Your information is protected with industry-standard encryption and never sold to third parties.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded p-2 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Speed & Efficiency</h3>
                  <p className="text-gray-600">
                    We know time is important. That's why we work quickly to get you your report as fast as possible.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded p-2 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Compassion</h3>
                  <p className="text-gray-600">
                    We understand that dealing with an accident is stressful. We're here to make at least one part easier.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-6 text-blue-100">
              Join thousands of people who've already used our free service
            </p>
            <Link
              href="/get-report/step-1"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Find My Accident Report
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
