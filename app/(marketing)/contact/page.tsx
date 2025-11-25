"use client";

import { useState } from "react";
import PageContainer from "@/components/PageContainer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    preferredContact: "email",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form data:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 bg-[#B6FF2C] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#05070B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Thanks!</h1>
          <p className="text-xl text-[#A5B1C5] leading-relaxed">
            We'll be in touch shortly. One of our team members will review your message and follow up with you.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Contact Our Team</h1>
          <p className="text-lg text-[#A5B1C5] leading-relaxed">
            Have questions or need assistance? Fill out the form below and someone from our team will review your situation and follow up with you shortly.
          </p>
        </div>

        <div className="bg-[#0C1016] rounded-[14px] p-8 border border-[#1C2430] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#05070B] border border-[#1C2430] rounded-lg text-white placeholder-[#A5B1C5] focus:outline-none focus:border-[#B6FF2C] focus:ring-1 focus:ring-[#B6FF2C] transition"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-white font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#05070B] border border-[#1C2430] rounded-lg text-white placeholder-[#A5B1C5] focus:outline-none focus:border-[#B6FF2C] focus:ring-1 focus:ring-[#B6FF2C] transition"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#05070B] border border-[#1C2430] rounded-lg text-white placeholder-[#A5B1C5] focus:outline-none focus:border-[#B6FF2C] focus:ring-1 focus:ring-[#B6FF2C] transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="preferredContact" className="block text-white font-semibold mb-2">
                Preferred Contact Method
              </label>
              <select
                id="preferredContact"
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#05070B] border border-[#1C2430] rounded-lg text-white focus:outline-none focus:border-[#B6FF2C] focus:ring-1 focus:ring-[#B6FF2C] transition appearance-none cursor-pointer"
              >
                <option value="phone">Phone Call</option>
                <option value="sms">SMS / Text Message</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-white font-semibold mb-2">
                Tell Us What Happened
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-[#05070B] border border-[#1C2430] rounded-lg text-white placeholder-[#A5B1C5] focus:outline-none focus:border-[#B6FF2C] focus:ring-1 focus:ring-[#B6FF2C] transition resize-none"
                placeholder="Please describe your situation or question..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#B6FF2C] text-[#05070B] px-8 py-4 rounded-lg font-bold text-base hover:bg-[#8EE522] transition-all shadow-lg hover:shadow-[0_0_18px_rgba(182,255,44,0.35)]"
            >
              Send Message
            </button>
          </form>
        </div>

        <p className="text-center text-[#A5B1C5] mt-6 text-sm">
          We typically respond within 24 hours during business days.
        </p>
      </div>
    </PageContainer>
  );
}
