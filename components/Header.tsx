"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1200px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">AccidentLookup</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/search"
              className="px-4 py-2 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium text-sm"
            >
              Accident Search
            </Link>
            <Link
              href="/accidents"
              className="px-4 py-2 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium text-sm"
            >
              Accident News
            </Link>
            <Link
              href="/how-it-works"
              className="px-4 py-2 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium text-sm"
            >
              How It Works
            </Link>
            <Link
              href="/legal-help"
              className="px-4 py-2 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium text-sm"
            >
              Legal Help
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium text-sm"
            >
              About
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="text-slate-600 hover:text-blue-800 transition font-medium text-sm px-3 py-2"
            >
              Contact
            </Link>
            <Link
              href="/search"
              className="bg-blue-800 text-white px-5 py-2.5 rounded-lg hover:bg-blue-900 transition-all font-semibold text-sm shadow-sm hover:shadow-md"
            >
              Search Accidents
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col gap-1">
              <Link
                href="/search"
                className="px-4 py-3 text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accident Search
              </Link>
              <Link
                href="/accidents"
                className="px-4 py-3 text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accident News
              </Link>
              <Link
                href="/how-it-works"
                className="px-4 py-3 text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/legal-help"
                className="px-4 py-3 text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Legal Help
              </Link>
              <Link
                href="/about"
                className="px-4 py-3 text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3 text-slate-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-3 px-4">
                <Link
                  href="/search"
                  className="block w-full bg-blue-800 text-white px-5 py-3 rounded-lg hover:bg-blue-900 transition-all font-semibold text-center shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search Accidents
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
