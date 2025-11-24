import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#05070B] text-white border-t border-[#1C2430]">
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16 max-w-[1200px]">
        {/* Three-column layout with wider left column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-6">
          {/* Brand Column - Wider */}
          <div className="md:col-span-1 lg:pr-8">
            <h3 className="text-xl font-bold mb-4 text-white">AccidentReports.com</h3>
            <p className="text-[#A5B1C5] leading-relaxed mb-6 text-base">
              Free accident and police reports for accident victims nationwide.
            </p>
            {/* Trust Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-white bg-[#0C1016] px-3 py-1.5 rounded border border-[#1C2430]">
                <svg className="w-4 h-4 text-[#B6FF2C]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white bg-[#0C1016] px-3 py-1.5 rounded border border-[#1C2430]">
                <svg className="w-4 h-4 text-[#B6FF2C]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Trusted</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-1">
            <h4 className="text-base font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition text-base leading-relaxed">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/get-report/step-1" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition text-base leading-relaxed">
                  Get Report
                </Link>
              </li>
              <li>
                <Link href="/legal-help" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition text-base leading-relaxed">
                  Legal Help
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition text-base leading-relaxed">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition text-base leading-relaxed">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal Column */}
          <div className="md:col-span-1">
            <h4 className="text-base font-bold mb-4 text-white">Resources</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/for-lawyers" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition text-base leading-relaxed">
                  For Lawyers
                </Link>
              </li>
            </ul>

            <h4 className="text-base font-bold mb-4 text-white mt-8">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition text-base leading-relaxed">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition text-base leading-relaxed">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1C2430] pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-[#A5B1C5] text-sm leading-relaxed">
              &copy; {new Date().getFullYear()} AccidentReports.com. All rights reserved.
            </p>
            <p className="text-[#A5B1C5] text-sm bg-[#0C1016] px-4 py-2 rounded border border-[#1C2430] leading-relaxed">
              Not a law firm. We connect you with legal professionals.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
