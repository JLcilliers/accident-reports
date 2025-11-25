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
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#1e40af"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{progress}%</span>
        <span className="text-xs text-slate-500">Searching</span>
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
                ? "bg-green-500"
                : isActive
                  ? "bg-blue-500 animate-pulse"
                  : "bg-slate-200"
            }`}>
              {isComplete ? (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              ) : isActive ? (
                <div className="w-2 h-2 bg-white rounded-full" />
              ) : null}
            </div>
            <span className={`text-sm transition-colors ${
              isComplete
                ? "text-green-700 font-medium"
                : isActive
                  ? "text-slate-900"
                  : "text-slate-400"
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
    <div className="grid grid-cols-3 gap-4 mt-6">
      {SOURCE_ICONS.map((source, index) => {
        const isActive = currentTime >= index * 500;
        const isComplete = currentTime >= index * 500 + 1000;

        return (
          <div
            key={source.name}
            className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
              isComplete
                ? "bg-green-50 border border-green-200"
                : isActive
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-slate-50 border border-slate-100"
            }`}
          >
            <span className={`text-2xl mb-1 transition-transform duration-300 ${isActive && !isComplete ? "animate-bounce" : ""}`}>
              {source.icon}
            </span>
            <span className={`text-xs text-center transition-colors ${
              isComplete ? "text-green-700" : isActive ? "text-blue-700" : "text-slate-400"
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
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Progress Circle */}
          <div className="flex-shrink-0">
            <CircularProgress progress={step.progress} />
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h2>
            <p className="text-slate-600 mb-6">{subtitle}</p>

            {step.id === "sources" ? (
              <SourceGrid currentTime={currentTime} />
            ) : (
              <TaskList tasks={step.tasks} currentTime={currentTime} />
            )}
          </div>
        </div>

        {/* Animated road/map decoration */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <div className="w-8 h-0.5 bg-slate-200 rounded" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <div className="w-16 h-0.5 bg-slate-200 rounded" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "200ms" }} />
            <div className="w-8 h-0.5 bg-slate-200 rounded" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "400ms" }} />
            <div className="w-16 h-0.5 bg-slate-200 rounded" />
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
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
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        {/* Success indicator */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
          Your Results Are Ready
        </h2>
        <p className="text-slate-600 text-center mb-6">
          We found potential matches{city && state ? ` in ${city}, ${state}` : ""}. Enter your email to view your results and stay updated on new incidents.
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            View My Results
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <p className="text-xs text-slate-500">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-blue-800 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-blue-800 hover:underline">Privacy Policy</Link>.
              We respect your privacy and never sell your information.
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-[1200px] py-4">
          <Link href="/" className="text-xl font-bold text-blue-800">
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
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index < currentStepIndex
                        ? "bg-green-500"
                        : index === currentStepIndex
                          ? "bg-blue-800 scale-125"
                          : "bg-slate-200"
                    }`}
                  />
                  {index < FUNNEL_STEPS.length - 1 && (
                    <div
                      className={`w-8 h-0.5 transition-all duration-300 ${
                        index < currentStepIndex ? "bg-green-500" : "bg-slate-200"
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
              className="text-slate-400 hover:text-slate-600 text-sm underline"
            >
              Skip to results
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-4">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <p className="text-center text-xs text-slate-500">
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Initializing search...</p>
        </div>
      </div>
    }>
      <SearchProgressContent />
    </Suspense>
  );
}
