import Link from "next/link";
import LogoMark from "@/components/LogoMark";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-14 lg:py-20 max-w-[1200px]">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6" aria-label="CarCrashReport.com home">
              <LogoMark className="h-8 w-8" />
              <span className="text-xl font-semibold tracking-tight text-neutral-900">
                CarCrashReport<span className="text-[#2A7D6E]">.com</span>
              </span>
            </Link>
            <p className="text-neutral-500 leading-relaxed text-sm max-w-sm">
              Up-to-date traffic accident news from across the United States, organized by state.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-medium text-neutral-400 mb-5 uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Accident Search
                </Link>
              </li>
              <li>
                <Link href="/accidents" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  News
                </Link>
              </li>
              <li>
                <Link href="/crash-reports" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Crash Report Guides
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-medium text-neutral-400 mb-5 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-medium text-neutral-400 mb-5 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Empty space for balance */}
          <div className="lg:col-span-2"></div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-100 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <p className="text-neutral-400 text-sm">
              &copy; {new Date().getFullYear()} CarCrashReport.com. All rights reserved.
            </p>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-2xl">
              This site provides informational resources only. Not a law firm. Information based on publicly available sources.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
