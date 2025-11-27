"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { STATE_OPTIONS, STATE_CITIES } from "@/lib/locationData";

export default function VideoHero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    month: "", // YYYY-MM format
  });

  // Get cities for selected state
  const citiesForState = useMemo(
    () => (formData.state ? STATE_CITIES[formData.state] ?? [] : []),
    [formData.state]
  );

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Reset city when state changes
  const handleStateChange = (newState: string) => {
    setFormData((prev) => ({
      ...prev,
      state: newState,
      city: "", // Reset city when state changes
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.state) {
      setError("Please select a state.");
      return;
    }
    if (!formData.city) {
      setError("Please select a city.");
      return;
    }

    setIsSubmitting(true);

    const params = new URLSearchParams();
    params.set("state", formData.state);
    params.set("city", formData.city);
    if (formData.month) {
      params.set("month", formData.month);
    }

    // Simulate brief loading then redirect
    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F5F5F5] -mt-16 lg:-mt-20 pt-16 lg:pt-20">
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
              Search by location and date to find crashes in your area.
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
              {/* Title */}
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">
                Accident Search
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* State Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        State
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all appearance-none bg-white cursor-pointer"
                      >
                        {STATE_OPTIONS.map((state) => (
                          <option key={state.value || "blank"} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        City
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          setError(null);
                        }}
                        disabled={!formData.state}
                        className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all appearance-none bg-white cursor-pointer disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
                      >
                        {!formData.state ? (
                          <option value="">Select a state first</option>
                        ) : (
                          <>
                            <option value="">Select city</option>
                            {citiesForState.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Month Picker */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Month of Accident{" "}
                      <span className="text-neutral-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="month"
                      value={formData.month}
                      onChange={(e) =>
                        setFormData({ ...formData, month: e.target.value })
                      }
                      className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-red-600 text-sm mt-3">{error}</p>
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
