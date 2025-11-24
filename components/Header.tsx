import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="https://i.ibb.co/8D1H26d5/Untitled-design-13.png"
              alt="AccidentReports.com"
              width={481}
              height={138}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/get-report/step-1" className="text-gray-700 hover:text-blue-600">
              Get Report
            </Link>
            <Link href="/legal-help" className="text-gray-700 hover:text-blue-600">
              Legal Help
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600">
              FAQ
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </nav>
          <Link
            href="/get-report/step-1"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
