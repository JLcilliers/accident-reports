"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Check if we're on the homepage (which has the video hero)
  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine header styles based on scroll and page
  const isTransparent = isHomepage && !isScrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Simple wordmark */}
          <Link
            href="/"
            className={`flex items-center hover:opacity-80 transition-opacity ${
              isTransparent ? "text-neutral-900" : "text-neutral-900"
            }`}
          >
            <span className="text-xl font-medium tracking-tight">
              AccidentLookup
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isTransparent
                  ? "text-neutral-700 hover:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Home
            </Link>
            <Link
              href="/search"
              className={`text-sm font-medium transition-colors ${
                isTransparent
                  ? "text-neutral-700 hover:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Accident Search
            </Link>
            <Link
              href="/accidents"
              className={`text-sm font-medium transition-colors ${
                isTransparent
                  ? "text-neutral-700 hover:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              News
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors ${
                isTransparent
                  ? "text-neutral-700 hover:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/legal-help"
              className={`text-sm font-medium transition-colors ${
                isTransparent
                  ? "text-neutral-700 hover:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Legal Help
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isTransparent
                  ? "text-neutral-700 hover:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Desktop CTA - Outlined button */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/legal-help"
              className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                isTransparent
                  ? "text-neutral-900 border border-neutral-400 hover:border-neutral-900 hover:bg-white/50"
                  : "text-neutral-900 border border-neutral-300 hover:border-neutral-900"
              }`}
            >
              Get Help
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isTransparent
                ? "text-neutral-700 hover:text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu - Clean dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 py-6 bg-white animate-fade-in">
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
