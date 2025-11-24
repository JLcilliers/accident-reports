import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t-2 border-gray-800">
      <div className="container mx-auto px-6 lg:px-12 py-14 lg:py-18">
        {/* Irregular column layout - varied widths with increased spacing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-14 mb-12">
          {/* Brand Column - Wider (5 cols on desktop) */}
          <div className="md:col-span-12 lg:col-span-5 md:pr-6 lg:pr-10 border-b md:border-b-0 md:border-r-0 lg:border-r border-gray-800 pb-8 md:pb-0 relative">
            {/* Subtle watermark icon */}
            <div className="absolute -top-2 -right-2 opacity-[0.03]">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3.5 text-white">AccidentReports.com</h3>
            <p className="text-gray-400 leading-loose mb-5 text-sm">
              Free accident and police reports for accident victims nationwide.
            </p>
            {/* Trust Badges - Subtle styling */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-800 px-2.5 py-1.5 rounded border border-gray-700">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-800 px-2.5 py-1.5 rounded border border-gray-700">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Trusted</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column - Medium (3 cols) */}
          <div className="md:col-span-6 lg:col-span-3 md:pl-0 lg:pl-6">
            <h4 className="text-base font-bold mb-4 text-white border-l-2 border-blue-600 pl-3">Quick Links</h4>
            <ul className="space-y-3 pl-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition text-sm leading-relaxed block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/get-report/step-1" className="text-gray-400 hover:text-white transition text-sm leading-relaxed block">
                  Get Report
                </Link>
              </li>
              <li>
                <Link href="/legal-help" className="text-gray-400 hover:text-white transition text-sm leading-relaxed block">
                  Legal Help
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition text-sm leading-relaxed block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Combined Resources & Legal Column - Narrower (4 cols) */}
          <div className="md:col-span-6 lg:col-span-4 md:pl-6 lg:pl-8">
            <div className="mb-8">
              <h4 className="text-base font-bold mb-4 text-white border-l-2 border-green-600 pl-3">Resources</h4>
              <ul className="space-y-3 pl-3">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition text-sm leading-relaxed block">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/for-lawyers" className="text-gray-400 hover:text-white transition text-sm leading-relaxed block">
                    For Lawyers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal section within same column */}
            <div className="pt-7 border-t border-gray-800">
              <h4 className="text-sm font-semibold mb-3.5 text-gray-300">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition text-xs leading-relaxed block">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition text-xs leading-relaxed block">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Subtle separator */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} AccidentReports.com. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs bg-gray-800 px-3 py-1.5 rounded border border-gray-700">
              Not a law firm. We connect you with legal professionals.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
