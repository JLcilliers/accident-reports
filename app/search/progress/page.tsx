"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Funnel step configuration
const FUNNEL_STEPS = [
  {
    id: "start",
    title: "Beginning Your Search",
    subtitle: "Looking up accident records based on your information...",
    duration: 2500,
    progress: 20,
    tasks: [
      { label: "Validating location data", delay: 0 },
      { label: "Preparing search parameters", delay: 800 },
    ],
  },
  {
    id: "details",
    title: "Gathering Accident Details",
    subtitle: "Matching your search to recent crashes in your area.",
    duration: 3000,
    progress: 45,
    tasks: [
      { label: "Matching date and location", delay: 0 },
      { label: "Checking vehicle types", delay: 600 },
      { label: "Analyzing severity information", delay: 1200 },
    ],
  },
  {
    id: "sources",
    title: "Checking Multiple Sources",
    subtitle: "Reviewing public accident reports, news, and official records.",
    duration: 3500,
    progress: 70,
    tasks: [
      { label: "Police & crash reports", delay: 0 },
      { label: "Local news & media", delay: 700 },
      { label: "Traffic incident databases", delay: 1400 },
      { label: "Weather & road conditions", delay: 2100 },
    ],
  },
  {
    id: "refine",
    title: "Refining Your Matches",
    subtitle: "Filtering results by time, location, and incident type.",
    duration: 2500,
    progress: 90,
    tasks: [
      { label: "Filtering by time window", delay: 0 },
      { label: "Distance from location", delay: 600 },
      { label: "Incident type matching", delay: 1200 },
    ],
  },
];

// Source icons for the "Checking Sources" step
const SOURCE_ICONS = [
  { name: "Police Reports", icon: "🚔", active: false },
  { name: "News Outlets", icon: "📰", active: false },
  { name: "Traffic Data", icon: "🚗", active: false },
  { name: "Weather Data", icon: "🌤️", active: false },
  { name: "Road Conditions", icon: "🛣️", active: false },
  { name: "Public Records", icon: "📋", active: false },
];

function CircularProgress({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#F0F0F0"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#2A7D6E"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-medium text-neutral-900">{progress}%</span>
        <span className="text-xs text-neutral-400">Searching</span>
      </div>
    </div>
  );
}

function TaskList({ tasks, currentTime }: { tasks: { label: string; delay: number }[]; currentTime: number }) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const isActive = currentTime >= task.delay;
        const isComplete = currentTime >= task.delay + 800;

        return (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
              isComplete
                ? "bg-[#2A7D6E]"
                : isActive
                  ? "bg-[#2A7D6E]/20"
                  : "bg-neutral-100"
            }`}>
              {isComplete ? (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              ) : isActive ? (
                <div className="w-2 h-2 bg-[#2A7D6E] rounded-full animate-pulse" />
              ) : null}
            </div>
            <span className={`text-sm transition-colors ${
              isComplete
                ? "text-[#2A7D6E] font-medium"
                : isActive
                  ? "text-neutral-900"
                  : "text-neutral-400"
            }`}>
              {task.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SourceGrid({ currentTime }: { currentTime: number }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {SOURCE_ICONS.map((source, index) => {
        const isActive = currentTime >= index * 500;
        const isComplete = currentTime >= index * 500 + 1000;

        return (
          <div
            key={source.name}
            className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
              isComplete
                ? "bg-[#E8F5F2] border border-[#2A7D6E]/20"
                : isActive
                  ? "bg-neutral-50 border border-neutral-200"
                  : "bg-neutral-50 border border-neutral-100"
            }`}
          >
            <span className={`text-xl mb-1.5 transition-transform duration-300 ${isActive && !isComplete ? "animate-bounce" : ""}`}>
              {source.icon}
            </span>
            <span className={`text-xs text-center transition-colors ${
              isComplete ? "text-[#2A7D6E]" : isActive ? "text-neutral-700" : "text-neutral-400"
            }`}>
              {source.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FunnelStep({
  step,
  currentTime,
  city,
  state,
}: {
  step: typeof FUNNEL_STEPS[0];
  currentTime: number;
  city: string;
  state: string;
}) {
  const subtitle = step.subtitle.replace("{City, State}", city && state ? `${city}, ${state}` : "your area");

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-neutral-100 p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Progress Circle */}
          <div className="flex-shrink-0">
            <CircularProgress progress={step.progress} />
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-medium text-neutral-900 mb-2 tracking-tight">{step.title}</h2>
            <p className="text-neutral-500 mb-6">{subtitle}</p>

            {step.id === "sources" ? (
              <SourceGrid currentTime={currentTime} />
            ) : (
              <TaskList tasks={step.tasks} currentTime={currentTime} />
            )}
          </div>
        </div>

        {/* Animated progress decoration */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-0.5 bg-neutral-100 rounded" />
            <div className="w-2 h-2 rounded-full bg-[#2A7D6E] animate-pulse" />
            <div className="w-16 h-0.5 bg-neutral-100 rounded" />
            <div className="w-2 h-2 rounded-full bg-[#2A7D6E] animate-pulse" style={{ animationDelay: "200ms" }} />
            <div className="w-8 h-0.5 bg-neutral-100 rounded" />
            <div className="w-2 h-2 rounded-full bg-[#2A7D6E] animate-pulse" style={{ animationDelay: "400ms" }} />
            <div className="w-16 h-0.5 bg-neutral-100 rounded" />
          </div>
          <p className="text-center text-xs text-neutral-400 mt-3">
            Searching accident databases...
          </p>
        </div>
      </div>
    </div>
  );
}

function EmailGate({
  onSubmit,
  city,
  state,
}: {
  onSubmit: (email: string) => void;
  city: string;
  state: string;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    onSubmit(email);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-neutral-100 p-8 md:p-10">
        {/* Success indicator */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#E8F5F2] rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-medium text-neutral-900 text-center mb-2 tracking-tight">
          Your Results Are Ready
        </h2>
        <p className="text-neutral-500 text-center mb-8">
          We found potential matches{city && state ? ` in ${city}, ${state}` : ""}. Enter your email to view your results.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
            />
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2A7D6E] text-white py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
          >
            View My Results
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100">
          <div className="flex items-start gap-3">
            <svg className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
            </svg>
            <p className="text-xs text-neutral-400">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-[#2A7D6E] hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-[#2A7D6E] hover:underline">Privacy Policy</Link>.
              We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTime, setStepTime] = useState(0);
  const [showEmailGate, setShowEmailGate] = useState(false);

  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const date = searchParams.get("date") || "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";

  // Build query string for results page
  const buildResultsUrl = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    if (date) params.set("date", date);
    if (firstName) params.set("firstName", firstName);
    if (lastName) params.set("lastName", lastName);
    params.set("verified", "true");
    return `/search?${params.toString()}`;
  };

  useEffect(() => {
    if (showEmailGate) return;

    const currentStep = FUNNEL_STEPS[currentStepIndex];
    if (!currentStep) {
      setShowEmailGate(true);
      return;
    }

    // Update step time for task animations
    const timeInterval = setInterval(() => {
      setStepTime((prev) => prev + 100);
    }, 100);

    // Move to next step after duration
    const stepTimeout = setTimeout(() => {
      setStepTime(0);
      if (currentStepIndex < FUNNEL_STEPS.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setShowEmailGate(true);
      }
    }, currentStep.duration);

    return () => {
      clearInterval(timeInterval);
      clearTimeout(stepTimeout);
    };
  }, [currentStepIndex, showEmailGate]);

  const handleEmailSubmit = (email: string) => {
    // Store email (in real app, send to backend)
    console.log("Email captured:", email);
    localStorage.setItem("searchEmail", email);
    localStorage.setItem("emailCapturedAt", new Date().toISOString());

    // Redirect to results
    router.push(buildResultsUrl());
  };

  const currentStep = FUNNEL_STEPS[currentStepIndex];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="container mx-auto px-6 max-w-[1200px] py-4">
          <Link href="/" className="text-xl font-medium tracking-tight text-neutral-900">
            AccidentLookup
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 max-w-[1200px] py-12 md:py-20">
        {/* Progress Steps Indicator */}
        {!showEmailGate && (
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2">
              {FUNNEL_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index < currentStepIndex
                        ? "bg-[#2A7D6E]"
                        : index === currentStepIndex
                          ? "bg-[#2A7D6E] scale-150"
                          : "bg-neutral-200"
                    }`}
                  />
                  {index < FUNNEL_STEPS.length - 1 && (
                    <div
                      className={`w-10 h-0.5 transition-all duration-300 ${
                        index < currentStepIndex ? "bg-[#2A7D6E]" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Step or Email Gate */}
        {showEmailGate ? (
          <EmailGate onSubmit={handleEmailSubmit} city={city} state={state} />
        ) : currentStep ? (
          <FunnelStep
            step={currentStep}
            currentTime={stepTime}
            city={city}
            state={state}
          />
        ) : null}

        {/* Skip option (for testing/development) */}
        {!showEmailGate && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowEmailGate(true)}
              className="text-neutral-400 hover:text-neutral-600 text-sm underline"
            >
              Skip to results
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 py-4">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <p className="text-center text-xs text-neutral-400">
            Information based on publicly available sources. Not legal advice. Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SearchProgressPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#2A7D6E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-500">Initializing search...</p>
        </div>
      </div>
    }>
      <SearchProgressContent />
    </Suspense>
  );
}
