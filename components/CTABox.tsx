import Link from "next/link";

interface CTABoxProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  phoneNumber?: string;
  variant?: "primary" | "secondary";
}

export default function CTABox({
  title = "Injured in an Accident?",
  description = "Get a free, no-obligation case review from experienced personal injury attorneys. No upfront costs.",
  buttonText = "Get Free Case Review",
  buttonHref = "/legal-help",
  phoneNumber = "1-800-ACCIDENT",
  variant = "primary",
}: CTABoxProps) {
  const bgColor = variant === "primary" ? "bg-blue-50" : "bg-gray-50";
  const borderColor = variant === "primary" ? "border-blue-200" : "border-gray-200";

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-6 shadow-md`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <ul className="mb-6 space-y-2 text-gray-700">
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          <span>No fees unless we win your case</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          <span>Free consultation with experienced attorneys</span>
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">✓</span>
          <span>Maximize your compensation</span>
        </li>
      </ul>
      <div className="space-y-3">
        <Link
          href={buttonHref}
          className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {buttonText}
        </Link>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Or call us now:</p>
          <a
            href={`tel:${phoneNumber.replace(/[^0-9]/g, "")}`}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700"
          >
            {phoneNumber}
          </a>
        </div>
      </div>
    </div>
  );
}
