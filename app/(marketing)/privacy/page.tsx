import PageContainer from "@/components/PageContainer";

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              At AccidentReports.com, we take your privacy seriously. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you use our website and
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Name and contact information (email, phone number)</li>
              <li>Accident details (date, location, type of incident)</li>
              <li>Information about injuries or damages</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Locate and provide you with accident reports</li>
              <li>Connect you with legal professionals if requested</li>
              <li>Communicate with you about your requests</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">With Your Consent</h3>
            <p>
              If you request legal assistance, we will share your information with partner law firms
              who can provide free case reviews. You explicitly consent to this sharing when you check
              the consent box on our forms.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Service Providers</h3>
            <p>
              We may share information with third-party service providers who help us operate our
              website and services, such as:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Database and record search services</li>
              <li>Email and communication platforms</li>
              <li>Analytics and performance monitoring tools</li>
              <li>Cloud hosting and storage providers</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid
              requests by public authorities.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">What We Don't Do</h3>
            <p className="font-semibold">
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              information, including:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure servers and databases</li>
              <li>Limited access to personal information</li>
              <li>Regular security assessments</li>
            </ul>
            <p className="mt-3">
              However, no method of transmission over the Internet is 100% secure. While we strive to
              protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to improve your experience on our website.
              You can control cookies through your browser settings. Note that disabling cookies may
              affect the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us at privacy@accidentreports.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you believe we have collected
              information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. California Privacy Rights</h2>
            <p>
              California residents have specific rights under the California Consumer Privacy Act (CCPA),
              including the right to know what personal information is collected, the right to delete
              personal information, and the right to opt-out of the sale of personal information.
            </p>
            <p className="mt-3">
              We do not sell personal information as defined by the CCPA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <p className="mt-3">
              Email: privacy@accidentreports.com<br />
              Address: [To be added]
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
