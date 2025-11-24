import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function Home() {
  return (
    <>
      {/* Hero Section with Video Background */}
      <section className="relative text-white py-32 overflow-hidden min-h-[800px] flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            src="https://streamable.com/e/q21jnj?autoplay=1&nocontrols=1&muted=1&loop=1"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute border-none"
            style={{
              width: '177.77vh',
              height: '56.25vw',
              minWidth: '100%',
              minHeight: '100%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </div>

        {/* Content */}
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
              Get Your Accident Report Online – Free
            </h1>
            <p className="text-xl mb-8 text-white drop-shadow-md">
              We locate and deliver your accident or police report at no cost.
              Plus, get a free case review from experienced personal injury attorneys.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-report/step-1"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-xl"
              >
                Find My Accident Report
              </Link>
              <Link
                href="/legal-help"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition border-2 border-white shadow-xl"
              >
                Get Free Case Review
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* How It Works Section */}
      <PageContainer>
        <section className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tell Us About Your Accident</h3>
              <p className="text-gray-600">
                Provide basic details about when and where your accident occurred.
                Takes less than 2 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">We Locate Your Report</h3>
              <p className="text-gray-600">
                Our system searches official databases to find your accident or police report.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Your Report + Legal Help</h3>
              <p className="text-gray-600">
                Download your report for free and get a no-obligation case review
                from experienced attorneys.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-gray-50 -mx-4 px-4 rounded-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Trusted by Accident Victims Nationwide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                <p className="text-gray-600">Reports Delivered</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600">Support Available</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-gray-600">Free Service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start">
              <div className="text-green-500 text-2xl mr-4">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Completely Free</h3>
                <p className="text-gray-600">
                  No hidden fees, no credit card required. Get your accident report at absolutely no cost.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-green-500 text-2xl mr-4">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
                <p className="text-gray-600">
                  Simple online process that takes minutes. No need to visit government offices.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-green-500 text-2xl mr-4">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure & Confidential</h3>
                <p className="text-gray-600">
                  Your information is protected with industry-standard encryption and security.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-green-500 text-2xl mr-4">✓</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Legal Support Available</h3>
                <p className="text-gray-600">
                  Connect with experienced attorneys for a free case review if you were injured.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 -mx-4 px-4 rounded-lg text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Accident Report?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Start now and get your free report in minutes
          </p>
          <Link
            href="/get-report/step-1"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block"
          >
            Get Started Now
          </Link>
        </section>
      </PageContainer>
    </>
  );
}
