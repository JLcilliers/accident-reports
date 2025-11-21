"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";

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
    // Clear error for this field
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
      <PageContainer>
        <div className="max-w-3xl mx-auto py-16 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Thank You!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Your information has been received. An experienced personal injury attorney
              will contact you within 24 hours to discuss your case.
            </p>
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3">What Happens Next?</h2>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>An attorney will review your case details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>You'll receive a call within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Free, no-obligation consultation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>No fees unless we win your case</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-600">
              In the meantime, avoid discussing the accident on social media and keep all
              medical records and bills.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Free Case Review</h1>
            <p className="text-xl text-blue-100">
              Injured in an accident? Get expert legal help at no upfront cost
            </p>
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {/* Form Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Get Started Today</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.state ? "border-red-500" : "border-gray-300"
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Injuries and Situation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Please describe what happened, your injuries, medical treatment received, etc."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {isSubmitting ? "Submitting..." : "Get Free Case Review"}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  By submitting this form, you agree to be contacted by an attorney regarding your case.
                  There is no obligation and the consultation is completely free.
                </p>
              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Why Contact Us?</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>No Upfront Costs:</strong> We work on contingency - no fees unless we win</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Free Consultation:</strong> No obligation to hire us</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Experienced Team:</strong> Handled thousands of accident cases</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span><strong>Maximum Compensation:</strong> We fight for every dollar you deserve</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-bold mb-3">⏰ Time is Critical</h3>
              <p className="text-sm text-gray-700 mb-3">
                Every state has deadlines (statutes of limitations) for filing injury claims.
                Don't wait until it's too late.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Evidence can disappear</li>
                <li>• Witnesses may forget details</li>
                <li>• You could miss legal deadlines</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Call us now:</p>
              <a
                href="tel:18002223333"
                className="text-3xl font-bold text-blue-600 hover:text-blue-700"
              >
                1-800-ACCIDENT
              </a>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export default function LegalHelpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
      <LegalHelpForm />
    </Suspense>
  );
}
