import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16 max-w-[1200px]">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">AccidentLookup</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 text-sm">
              Your source for traffic accident information. Search recent incidents, get connected with legal help, and understand your options.
            </p>
            {/* Trust Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Trusted</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  Accident Search
                </Link>
              </li>
              <li>
                <Link href="/accidents" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  Latest Accidents
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/legal-help" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  Legal Help
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/guides" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  Accident Guides
                </Link>
              </li>
              <li>
                <Link href="/get-report/step-1" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  Get Your Police Report
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/for-lawyers" className="text-slate-600 hover:text-blue-800 transition text-sm">
                  For Lawyers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} AccidentLookup. All rights reserved.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> This site is not a law firm and does not provide legal advice. Information is based on publicly available sources and may change as investigations continue. Not affiliated with any government agency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
