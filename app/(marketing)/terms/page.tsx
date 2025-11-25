import PageContainer from "@/components/PageContainer";

export default function TermsPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-[#A5B1C5]">Last Updated: January 2025</p>
      </div>

      <div className="space-y-6">
        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            By accessing and using AI First Accident Reports (the "Service"), you accept and agree to be bound
            by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">
            AI First Accident Reports provides a free service to help users locate and obtain accident and
            police reports using AI and automation technology. We search various databases and public records to find reports matching
            the information you provide.
          </p>
          <p className="text-[#A5B1C5] leading-relaxed">
            We also offer optional legal referral services to connect users with personal injury
            attorneys for free case reviews.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">3. User Obligations</h2>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">By using this Service, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>Provide accurate and truthful information when requesting reports</li>
            <li>Use the Service only for lawful purposes</li>
            <li>Not misrepresent your identity or relationship to any accident</li>
            <li>Not use automated systems to access the Service</li>
            <li>Comply with all applicable local, state, and federal laws</li>
          </ul>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">4. Privacy and Data Use</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            Your use of the Service is also governed by our Privacy Policy. By using the Service,
            you consent to the collection and use of your information as described in our Privacy Policy.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">5. No Warranty</h2>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">
            The Service is provided "as is" without warranties of any kind, either express or implied.
            We do not guarantee that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>All accident reports will be available or found</li>
            <li>Reports will be delivered within a specific timeframe</li>
            <li>Information in reports will be accurate or complete</li>
            <li>The Service will be uninterrupted or error-free</li>
          </ul>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">6. Limitation of Liability</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            To the maximum extent permitted by law, AI First Accident Reports shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages resulting from your use
            of or inability to use the Service.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">7. Legal Referrals</h2>
          <p className="text-[#A5B1C5] leading-relaxed mb-3">
            If you choose to be connected with an attorney through our Service:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#A5B1C5]">
            <li>We are not a law firm and do not provide legal advice</li>
            <li>Attorney-client relationships are formed directly with the law firm, not with us</li>
            <li>We may receive compensation from attorneys for referrals</li>
            <li>You are under no obligation to hire any attorney we connect you with</li>
          </ul>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">8. Modifications to Terms</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. Changes will be effective
            immediately upon posting. Your continued use of the Service after changes are posted
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">9. Termination</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            We reserve the right to terminate or suspend access to the Service at any time, without
            notice, for any reason, including violation of these Terms of Service.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">10. Governing Law</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            These Terms of Service shall be governed by and construed in accordance with the laws of
            the United States, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="bg-[#0C1016] rounded-[14px] p-6 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-4">11. Contact Information</h2>
          <p className="text-[#A5B1C5] leading-relaxed">
            If you have questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-[#B6FF2C] mt-3">
            Email: legal@aifirstaccidentreports.com
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
