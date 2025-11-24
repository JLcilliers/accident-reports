import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-90 transition">
            <Image
              src="https://i.ibb.co/8D1H26d5/Untitled-design-13.png"
              alt="AccidentReports.com"
              width={481}
              height={138}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition font-medium text-sm relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/get-report/step-1" className="text-gray-700 hover:text-blue-600 transition font-medium text-sm relative group">
              Get Report
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/legal-help" className="text-gray-700 hover:text-blue-600 transition font-semibold text-sm relative group ml-2">
              Legal Help
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600 transition font-medium text-sm relative group">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition font-medium text-sm relative group mr-1">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          <Link
            href="/get-report/step-1"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-bold text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
