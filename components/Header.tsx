import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-[#0C1016] shadow-md border-b border-[#1C2430] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-90 transition">
            <Image
              src="https://i.ibb.co/h1xrZXZM/Untitled-design-35.png"
              alt="AccidentReports.com"
              width={481}
              height={138}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition font-medium text-sm relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B6FF2C] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/get-report/step-1" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition font-medium text-sm relative group">
              Get Report
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B6FF2C] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/legal-help" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition font-semibold text-sm relative group ml-2">
              Legal Help
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B6FF2C] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/faq" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition font-medium text-sm relative group">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B6FF2C] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/about" className="text-[#A5B1C5] hover:text-[#B6FF2C] transition font-medium text-sm relative group mr-1">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B6FF2C] group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          <Link
            href="/get-report/step-1"
            className="bg-[#B6FF2C] text-[#05070B] px-6 py-2.5 rounded-md hover:bg-[#8EE522] transition-all shadow-lg hover:shadow-[0_0_18px_rgba(182,255,44,0.35)] font-bold text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
