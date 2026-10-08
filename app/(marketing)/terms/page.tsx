import type { Metadata } from "next";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using CarCrashReport.com, a free site that summarizes traffic accidents reported in the news.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-neutral-500">Last Updated: October 2026</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-neutral-600 leading-relaxed">
            By accessing and using CarCrashReport (the &quot;Service&quot;), you accept and agree to be bound
            by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">2. Description of Service</h2>
          <p className="text-neutral-600 leading-relaxed">
            CarCrashReport is a free website that publishes summaries of traffic accidents reported
            by news organizations across the United States, organized by state, with links to the
            original coverage. Summaries are produced automatically from published news reports.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">3. Information Only</h2>
          <p className="text-neutral-600 leading-relaxed">
            Content on this site is general information. It is not an official accident report, and
            it is not legal or medical advice. We are not a law firm and are not affiliated with any
            government agency. For official records, contact the law-enforcement agency that handled
            the crash.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">4. Use of the Service</h2>
          <p className="text-neutral-600 leading-relaxed mb-3">By using this Service, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-600">
            <li>Use the Service only for lawful purposes</li>
            <li>Not interfere with or disrupt the operation of the Service</li>
            <li>Comply with all applicable local, state, and federal laws</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">5. Privacy</h2>
          <p className="text-neutral-600 leading-relaxed">
            Your use of the Service is also governed by our Privacy Policy.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">6. No Warranty</h2>
          <p className="text-neutral-600 leading-relaxed mb-3">
            The Service is provided &quot;as is&quot; without warranties of any kind, either express or implied.
            We do not guarantee that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-600">
            <li>Information on the site is accurate, complete or up to date</li>
            <li>Every accident is covered</li>
            <li>The Service will be uninterrupted or error-free</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-neutral-600 leading-relaxed">
            To the maximum extent permitted by law, CarCrashReport shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages resulting from your use
            of or inability to use the Service.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">8. Links to Other Websites</h2>
          <p className="text-neutral-600 leading-relaxed">
            Incident pages link to news websites that we do not control. We are not responsible for
            their content or availability.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">9. Modifications to Terms</h2>
          <p className="text-neutral-600 leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. Changes will be effective
            immediately upon posting. Your continued use of the Service after changes are posted
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">10. Termination</h2>
          <p className="text-neutral-600 leading-relaxed">
            We reserve the right to terminate or suspend access to the Service at any time, without
            notice, for any reason, including violation of these Terms of Service.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-medium text-neutral-900 mb-4">11. Governing Law</h2>
          <p className="text-neutral-600 leading-relaxed">
            These Terms of Service shall be governed by and construed in accordance with the laws of
            the United States, without regard to its conflict of law provisions.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
