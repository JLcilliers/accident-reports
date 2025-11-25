import PageContainer from "@/components/PageContainer";

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-[#A5B1C5]">Last Updated: January 2025</p>
      </div>

      <div className="space-y-6">
        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            At AI First Accident Reports, we take your privacy seriously. This Privacy Policy explains how
            we collect, use, disclose, and safeguard your information when you use our website and
            services.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold text-white mt-4 mb-2">Personal Information</h3>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>Name and contact information (email, phone number)</li>
            <li>Accident details (date, location, type of incident)</li>
            <li>Information about injuries or damages</li>
            <li>Any other information you choose to provide</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-2">Automatically Collected Information</h3>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">When you visit our website, we automatically collect:</p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">3. How We Use Your Information</h2>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>Locate and provide you with accident reports</li>
            <li>Connect you with legal professionals if requested</li>
            <li>Communicate with you about your requests</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>

          <h3 className="text-lg font-semibold text-white mt-4 mb-2">With Your Consent</h3>
          <p className="text-[#A5B1C5] leading-relaxed">
            If you request legal assistance, we will share your information with partner law firms
            who can provide free case reviews. You explicitly consent to this sharing when you check
            the consent box on our forms.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-2">Service Providers</h3>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">
            We may share information with third-party service providers who help us operate our
            website and services, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>Database and record search services</li>
            <li>Email and communication platforms</li>
            <li>Analytics and performance monitoring tools</li>
            <li>Cloud hosting and storage providers</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-2">What We Don't Do</h3>
          <p className="text-[#B6FF2C] font-semibold">
            We do not sell your personal information to third parties for marketing purposes.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">5. Data Security</h2>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">
            We implement appropriate technical and organizational measures to protect your personal
            information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>Encryption of data in transit and at rest</li>
            <li>Secure servers and databases</li>
            <li>Limited access to personal information</li>
            <li>Regular security assessments</li>
          </ul>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">6. Your Privacy Rights</h2>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>
          <p className="text-[#A5B1C5] leading-relaxed mt-4">
            To exercise these rights, please contact us at <span className="text-[#B6FF2C]">privacy@aifirstaccidentreports.com</span>
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">7. California Privacy Rights</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            California residents have specific rights under the California Consumer Privacy Act (CCPA),
            including the right to know what personal information is collected, the right to delete
            personal information, and the right to opt-out of the sale of personal information.
          </p>
          <p className="text-[#B6FF2C] font-semibold mt-3">
            We do not sell personal information as defined by the CCPA.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">8. Changes to This Privacy Policy</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">9. Contact Us</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            If you have questions or concerns about this Privacy Policy, please contact us:
          </p>
          <p className="text-[#B6FF2C] mt-3">
            Email: privacy@aifirstaccidentreports.com
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
