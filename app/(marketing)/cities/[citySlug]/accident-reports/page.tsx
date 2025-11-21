import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import CTABox from "@/components/CTABox";

// Sample cities for demonstration
const cityData: Record<string, { name: string; state: string; info: string }> = {
  denver: {
    name: "Denver",
    state: "Colorado",
    info: "Denver Police Department handles all accident reports within city limits. Reports are typically available within 7-10 business days and can be accessed through the Denver PD Records Division.",
  },
  austin: {
    name: "Austin",
    state: "Texas",
    info: "The Austin Police Department processes accident reports for incidents within city limits. Reports are generally ready within 10-14 business days from the date of the accident.",
  },
  miami: {
    name: "Miami",
    state: "Florida",
    info: "Miami-Dade Police Department maintains accident records for the Miami area. Reports are usually available within 5-7 business days and can be obtained from the Traffic Investigations Unit.",
  },
};

export async function generateStaticParams() {
  return Object.keys(cityData).map((slug) => ({
    citySlug: slug,
  }));
}

export default async function CityAccidentReportsPage({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;
  const city = cityData[citySlug];

  if (!city) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {city.name}, {city.state} Accident Reports – Free Online Access
          </h1>
          <p className="text-xl text-gray-600">
            Get your {city.name} accident report online - fast, easy, and completely free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">
                Accident Reports in {city.name}
              </h2>
              <p className="text-gray-700 mb-4">{city.info}</p>
              <p className="text-gray-700 mb-6">
                Skip the hassle of dealing with government offices. We'll locate your accident
                report and deliver it to you at no cost.
              </p>
              <Link
                href={`/get-report/step-1?state=${city.state}&city=${city.name}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get My {city.name} Accident Report
              </Link>
            </div>

            {/* Local Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">
                Why {city.name} Residents Choose Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded p-2 mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Save Time</h3>
                    <p className="text-sm text-gray-600">
                      No need to visit police stations or wait in line
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded p-2 mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">100% Free</h3>
                    <p className="text-sm text-gray-600">
                      No fees, no hidden charges, no credit card required
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded p-2 mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure</h3>
                    <p className="text-sm text-gray-600">
                      Your information is protected and confidential
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded p-2 mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast Delivery</h3>
                    <p className="text-sm text-gray-600">
                      Most reports delivered within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Questions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">
                Common Questions from {city.name} Residents
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    How soon after an accident can I get the report?
                  </h3>
                  <p className="text-gray-600">
                    Reports are typically available 5-14 days after the accident, depending on
                    how quickly the police department processes them. Once available, we can
                    deliver it to you within 24-48 hours.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    What if I don't remember all the details?
                  </h3>
                  <p className="text-gray-600">
                    That's okay! We only need basic information like the date and location of
                    the accident. Our system will search for matching reports.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Do I need the police report number?
                  </h3>
                  <p className="text-gray-600">
                    No, you don't need the report number. We can locate your report using the
                    date, location, and other basic details about the accident.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Help CTA */}
            <div className="bg-blue-600 rounded-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Were You Injured?</h2>
              <p className="text-xl mb-6 text-blue-100">
                {city.name} accident victims may be entitled to compensation for injuries,
                medical bills, and lost wages.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Free case review with experienced attorneys</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>No fees unless we win your case</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Serving {city.name} residents for years</span>
                </li>
              </ul>
              <Link
                href="/legal-help"
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Free Legal Consultation
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-4 space-y-6">
              <CTABox
                title={`Get Your ${city.name} Report`}
                description="Find your accident report in minutes - completely free."
                buttonText="Get Started"
                buttonHref={`/get-report/step-1?state=${city.state}&city=${city.name}`}
              />

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">5,000+</div>
                    <p className="text-sm text-gray-600">
                      {city.name} reports delivered
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">24-48hrs</div>
                    <p className="text-sm text-gray-600">Average delivery time</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <p className="text-sm text-gray-600">Free service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
