"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

function LegalHelpForm() {
  const searchParams = useSearchParams();
  const reportId = searchParams?.get("reportId");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.description) newErrors.description = "Please describe your situation";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/legal-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          reportId: reportId || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setErrors({ submit: data.error || "Failed to submit request" });
      }
    } catch (error) {
      console.error("Error submitting legal lead:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12 max-w-[800px] py-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center">
            <div className="bg-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h1>
            <p className="text-lg text-slate-600 mb-8">
              Your information has been received. An experienced personal injury attorney will contact you within 24 hours to discuss your case.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">What Happens Next?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>An attorney will review your case details</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>You&apos;ll receive a call within 24 hours</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Free, no-obligation consultation</span>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>No fees unless we win your case</span>
                </li>
              </ul>
            </div>

            <p className="text-slate-600 text-sm mb-6">
              In the meantime, avoid discussing the accident on social media and keep all medical records and bills.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-800 hover:text-blue-900 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">Legal Help</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Free Case Review
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Were you injured in an accident? Get a free, confidential consultation with an experienced personal injury attorney. No fees unless you win.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px] py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Get Started Today</h2>
              <p className="text-slate-600 mb-6">Fill out the form below and an attorney will contact you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.name ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.email ? "border-red-500" : "border-slate-300"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.phone ? "border-red-500" : "border-slate-300"
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white ${
                      errors.state ? "border-red-500" : "border-slate-300"
                    }`}
                  >
                    <option value="">Select your state</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Describe Your Situation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                      errors.description ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="Please describe what happened, your injuries, medical treatment received, etc."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-800 text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-blue-900 transition disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Get Free Case Review"
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Your information is secure and confidential</span>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            {/* Why Contact Us */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h3 className="font-bold text-slate-900 mb-4">Why Contact Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">No Upfront Costs</p>
                    <p className="text-slate-600 text-xs">We work on contingency - no fees unless we win</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Free Consultation</p>
                    <p className="text-slate-600 text-xs">No obligation to hire us</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Experienced Team</p>
                    <p className="text-slate-600 text-xs">Handled thousands of accident cases</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Maximum Compensation</p>
                    <p className="text-slate-600 text-xs">We fight for every dollar you deserve</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Time Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <h3 className="font-bold text-amber-900 mb-2">Time is Critical</h3>
                  <p className="text-amber-800 text-sm mb-3">
                    Every state has deadlines for filing injury claims. Don&apos;t wait until it&apos;s too late.
                  </p>
                  <ul className="text-amber-800 text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
                      Evidence can disappear
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
                      Witnesses may forget details
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
                      You could miss legal deadlines
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phone CTA */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-5 text-center text-white">
              <p className="text-blue-200 text-sm mb-2">Prefer to call?</p>
              <a
                href="tel:18002223333"
                className="text-2xl font-bold hover:text-blue-200 transition block mb-2"
              >
                1-800-ACCIDENT
              </a>
              <p className="text-blue-200 text-xs">Available 24/7</p>
            </div>
          </div>
        </div>

        {/* What Types of Cases Section */}
        <div className="mt-12 lg:mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Types of Cases We Handle</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Car Accidents", icon: "🚗" },
              { title: "Truck Accidents", icon: "🚛" },
              { title: "Motorcycle Crashes", icon: "🏍️" },
              { title: "Pedestrian Accidents", icon: "🚶" },
              { title: "Bicycle Accidents", icon: "🚴" },
              { title: "Rideshare Accidents", icon: "📱" },
              { title: "Hit and Run", icon: "🏃" },
              { title: "Wrongful Death", icon: "⚖️" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-md transition">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-slate-900 font-medium text-sm">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-xs leading-relaxed text-center">
            <strong>Disclaimer:</strong> By submitting this form, you agree to be contacted by an attorney regarding your case.
            There is no obligation and the consultation is completely free. This site is not a law firm and does not provide legal advice.
            Attorney services are provided by licensed attorneys in your state.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LegalHelpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <LegalHelpForm />
    </Suspense>
  );
}
