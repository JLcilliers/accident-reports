import PageContainer from "@/components/PageContainer";

export default function ForLawyersPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-5xl font-bold mb-6">Partner With Us</h1>
        <p className="text-xl text-gray-600 mb-12">
          Generate high-quality personal injury leads from accident victims actively seeking legal help
        </p>

        <div className="space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Why Partner With AccidentReports.com?</h2>
            <p className="text-gray-700 mb-4">
              We connect personal injury law firms with accident victims at the exact moment they
              need legal assistance - right after they've obtained their accident report and
              confirmed the details of their case.
            </p>
            <p className="text-gray-700">
              Our platform generates exclusive, high-intent leads from people who have been injured
              in accidents and are actively looking for legal representation.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-6">Benefits of Partnership</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded p-2 mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">High-Quality Leads</h3>
                  <p className="text-gray-600">
                    Accident victims who have already documented their case and are ready to pursue legal action
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded p-2 mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Verified Information</h3>
                  <p className="text-gray-600">
                    Leads come with accident report details, injury information, and contact preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded p-2 mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Nationwide Coverage</h3>
                  <p className="text-gray-600">
                    We generate leads from all 50 states, allowing you to expand your practice area
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded p-2 mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Performance-Based</h3>
                  <p className="text-gray-600">
                    Flexible partnership models designed to maximize your ROI
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Accident Victims Find Their Reports</h3>
                  <p className="text-gray-600">
                    People use our platform to obtain free accident reports, often discovering the
                    extent of their case for the first time.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">We Identify Legal Opportunities</h3>
                  <p className="text-gray-600">
                    Users who indicate injuries or damages are offered free legal consultations
                    with experienced attorneys.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Qualified Leads Are Delivered</h3>
                  <p className="text-gray-600">
                    Partner firms receive detailed lead information including accident details,
                    injuries, and contact information - all in real-time.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">You Convert and Win Cases</h3>
                  <p className="text-gray-600">
                    Your firm contacts the client, provides consultation, and converts them into
                    paying cases.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Quality */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">What Makes Our Leads Different</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>
                  <strong>Pre-Qualified:</strong> All leads have confirmed injuries or significant damages
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>
                  <strong>Documented:</strong> Accident reports already obtained, providing case details
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>
                  <strong>Motivated:</strong> Actively seeking legal representation, not just browsing
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>
                  <strong>Exclusive:</strong> Options for exclusive leads in your practice area
                </span>
              </li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in Partnering?</h2>
            <p className="text-xl mb-6 text-blue-100">
              Contact us to learn more about our partnership opportunities and lead generation programs
            </p>
            <a
              href="mailto:partners@accidentreports.com"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Us
            </a>
            <p className="mt-4 text-blue-100">
              Email: partners@accidentreports.com
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
