"use client";

import { useState, useEffect, useRef } from "react";
import { HomeAccidentWizard } from "@/components/HomeAccidentWizard";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-[#F5F5F5] -mt-16 lg:-mt-20 pt-16 lg:pt-20">
      {/* Video Background - overflow-hidden moved here for Safari compatibility */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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

          {/* Wizard Card */}
          <div
            className={`w-full transition-all duration-700 ease-out delay-150 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <HomeAccidentWizard />
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
