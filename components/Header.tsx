"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Simple wordmark */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <span className="text-xl font-medium tracking-tight text-neutral-900">
              AccidentLookup
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
            >
              Accident Search
            </Link>
            <Link
              href="/accidents"
              className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
            >
              News
            </Link>
            <Link
              href="/how-it-works"
              className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
            >
              How It Works
            </Link>
            <Link
              href="/legal-help"
              className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
            >
              Legal Help
            </Link>
            <Link
              href="/about"
              className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium"
            >
              About
            </Link>
          </nav>

          {/* Desktop CTA - Outlined button */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/legal-help"
              className="px-5 py-2 text-sm font-medium text-neutral-900 border border-neutral-300 rounded-full hover:border-neutral-900 transition-colors"
            >
              Get Help
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - Clean dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 py-6 animate-fade-in">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/search"
                className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accident Search
              </Link>
              <Link
                href="/accidents"
                className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/how-it-works"
                className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/legal-help"
                className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Legal Help
              </Link>
              <Link
                href="/about"
                className="px-4 py-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-4 px-4">
                <Link
                  href="/legal-help"
                  className="block w-full text-center px-5 py-3 text-sm font-medium text-neutral-900 border border-neutral-300 rounded-full hover:border-neutral-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Help
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
