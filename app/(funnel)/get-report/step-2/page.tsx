"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import StepIndicator from "@/components/StepIndicator";

export default function Step2Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    injuredOrDamage: false,
    consentLegalContact: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if we have accident details from step 1
    const accidentDetails = sessionStorage.getItem("accidentDetails");
    if (!accidentDetails) {
      // Redirect back to step 1 if no data
      router.push("/get-report/step-1");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.consentLegalContact) {
      newErrors.consentLegalContact = "You must agree to be contacted";
    }

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
      // Get accident details from session storage
      const accidentDetailsStr = sessionStorage.getItem("accidentDetails");
      if (!accidentDetailsStr) {
        router.push("/get-report/step-1");
        return;
      }

      const accidentDetails = JSON.parse(accidentDetailsStr);

      // Submit to API
      const response = await fetch("/api/report-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accidentDetails,
          contact: formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store request ID and matched report ID in session storage
        sessionStorage.setItem("requestId", data.requestId);
        if (data.matchedReportId) {
          sessionStorage.setItem("matchedReportId", data.matchedReportId);
        }

        // Navigate to step 3
        router.push("/get-report/step-3");
      } else {
        setErrors({ submit: data.error || "Failed to submit request" });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto py-8">
        <StepIndicator currentStep={2} />

        <div className="bg-white rounded-lg shadow-md p-5 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Contact Information</h1>
          <p className="text-gray-600 mb-6">
            We'll use this information to deliver your free accident report
          </p>

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

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
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
                Phone Number (Recommended)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
              />
              <p className="text-sm text-gray-500 mt-1">
                We may call to verify details or provide updates
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-start mb-4">
                <input
                  type="checkbox"
                  id="injuredOrDamage"
                  name="injuredOrDamage"
                  checked={formData.injuredOrDamage}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="injuredOrDamage" className="ml-3 text-sm text-gray-700">
                  I was injured in this accident or had vehicle damage
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consentLegalContact"
                  name="consentLegalContact"
                  checked={formData.consentLegalContact}
                  onChange={handleChange}
                  className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                    errors.consentLegalContact ? "border-red-500" : ""
                  }`}
                />
                <label htmlFor="consentLegalContact" className="ml-3 text-sm text-gray-700">
                  I agree to be contacted about legal options and free case review{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.consentLegalContact && (
                <p className="text-red-500 text-sm mt-1">{errors.consentLegalContact}</p>
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
              {isSubmitting ? "Submitting..." : "Continue to Get Report"}
            </button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
