"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const US_STATES = [
  { value: "", label: "Select State" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function VideoHero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTab, setSearchTab] = useState<"location" | "name">("location");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    date: "",
  });

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const params = new URLSearchParams();
    if (searchTab === "location") {
      if (formData.city) params.set("city", formData.city);
      if (formData.state) params.set("state", formData.state);
      if (formData.date) params.set("date", formData.date);
    } else {
      if (formData.firstName) params.set("firstName", formData.firstName);
      if (formData.lastName) params.set("lastName", formData.lastName);
      if (formData.state) params.set("state", formData.state);
    }

    // Simulate brief loading then redirect
    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push(`/search/progress?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F5F5F5]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => {}}
        >
          <source src="https://res.cloudinary.com/dovgh19xr/video/upload/v1764098845/Video_Generation_City_to_Calm_Relief_m3bqs6.mp4" type="video/mp4" />
        </video>

        {/* White Gradient Overlay - Creates the clinical, readable aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/90" />

        {/* Additional subtle overlay for more contrast */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="flex flex-col items-center lg:items-start">
          {/* Heading & Subheading */}
          <div
            className={`text-center lg:text-left mb-10 max-w-2xl transition-all duration-700 ease-out ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-neutral-900 mb-5 tracking-tight leading-[1.1]">
              Find Information About Recent Traffic Accidents
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
              Search by name, date, and location to find crashes that may involve you or someone you care about.
            </p>
          </div>

          {/* Search Card */}
          <div
            className={`w-full max-w-2xl transition-all duration-700 ease-out delay-150 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-neutral-100 p-6 md:p-8 hover:shadow-[0_12px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              {/* Tab Pills */}
              <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-full w-fit">
                <button
                  type="button"
                  onClick={() => setSearchTab("location")}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    searchTab === "location"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  Accident Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab("name")}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    searchTab === "name"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  Search by Name
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {searchTab === "location" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          State
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all appearance-none bg-white cursor-pointer"
                        >
                          {US_STATES.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Date{" "}
                        <span className="text-neutral-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          First Name{" "}
                          <span className="text-neutral-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Last Name{" "}
                          <span className="text-neutral-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          City{" "}
                          <span className="text-neutral-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          State
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all appearance-none bg-white cursor-pointer"
                        >
                          {US_STATES.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Date{" "}
                        <span className="text-neutral-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-[#2A7D6E] text-white px-6 py-4 rounded-xl hover:bg-[#236859] transition-all font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    "Search Accidents"
                  )}
                </button>
              </form>

              {/* Disclaimer */}
              <p className="text-xs text-neutral-400 text-center mt-5 leading-relaxed">
                Information is based on public reports. This site is not a law firm or government agency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-neutral-300 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
