"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STATE_OPTIONS, STATE_CITIES } from "@/lib/locationData";

type Answers = {
  state?: string;
  city?: string;
  month?: string;
  involvement?: string;
  medical?: string;
  lawyer?: string;
  name?: string;
  surname?: string;
  email?: string;
};

const STEP_IDS = [
  "location",    // Step 1: state, city, month
  "involvement", // Step 2: injured/involved/on behalf
  "medical",     // Step 3: medical help needed
  "lawyer",      // Step 4: have a lawyer?
  "name",        // Step 5: first & last name
  "email",       // Step 6: email address
] as const;

type StepId = (typeof STEP_IDS)[number];

/* ---------- Step-Specific AI Transition Copy ---------- */

type TransitionCopy = {
  title: string;
  body: string;
  icon: "location" | "person" | "medical" | "legal" | "profile";
};

const TRANSITIONS: Record<StepId, TransitionCopy> = {
  location: {
    title: "Searching crashes in your area",
    body: "Your location helps us match you with the right accident reports and local resources.",
    icon: "location",
  },
  involvement: {
    title: "Tailoring results to your situation",
    body: "Understanding your role helps us prioritize information that matters most to you.",
    icon: "person",
  },
  medical: {
    title: "Checking injury-related reports",
    body: "Medical details help identify which accidents may be relevant to your case.",
    icon: "medical",
  },
  lawyer: {
    title: "Reviewing legal resource options",
    body: "We're preparing information about legal support and next steps for your situation.",
    icon: "legal",
  },
  name: {
    title: "Personalizing your accident report",
    body: "Your information helps us create a customized summary just for you.",
    icon: "profile",
  },
  email: {
    title: "Preparing your report",
    body: "We're compiling all matching accidents to send to your inbox.",
    icon: "profile",
  },
};

export function HomeAccidentWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSearching, setIsSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentStepId: StepId = STEP_IDS[stepIndex];
  const isLastStep = stepIndex === STEP_IDS.length - 1;
  const totalSteps = STEP_IDS.length;

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / totalSteps) * 100),
    [stepIndex, totalSteps]
  );

  function updateAnswer<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function require(value: string | undefined, message: string) {
    if (!value || !value.trim()) {
      setError(message);
      return false;
    }
    return true;
  }

  async function goNext() {
    // Validate current step
    if (currentStepId === "location") {
      if (
        !require(answers.state, "Please select the state where the accident happened.") ||
        !require(answers.city, "Please select the city where the accident happened.")
      ) {
        return;
      }
    } else if (currentStepId === "involvement") {
      if (!require(answers.involvement, "Please select how you were involved.")) return;
    } else if (currentStepId === "medical") {
      if (!require(answers.medical, "Please tell us if medical help was required.")) return;
    } else if (currentStepId === "lawyer") {
      if (!require(answers.lawyer, "Please let us know if you have a lawyer.")) return;
    } else if (currentStepId === "name") {
      if (
        !require(answers.name, "Please enter your first name.") ||
        !require(answers.surname, "Please enter your last name.")
      ) {
        return;
      }
    }

    // Show "searching database" animation between steps
    if (!isLastStep) {
      setIsSearching(true);
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setIsSearching(false);
      setStepIndex((prev) => prev + 1);
    }
  }

  function goBack() {
    if (stepIndex === 0 || isSearching || submitting) return;
    setStepIndex((prev) => prev - 1);
    setError(null);
  }

  async function handleSubmit() {
    if (!require(answers.email, "Please enter your email so we can send your report.")) {
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(answers.email || "")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        answers: {
          state: answers.state,
          city: answers.city,
          month: answers.month,
          involvement: answers.involvement,
          medical: answers.medical,
          lawyer: answers.lawyer,
        },
        contact: {
          name: `${answers.name} ${answers.surname}`.trim(),
          email: answers.email,
          phone: null,
          details: null,
        },
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/leads/accident-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setIsComplete(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Success state
  if (isComplete) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-neutral-100 p-8 md:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#E8F5F2] rounded-full flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-8 h-8 text-[#2A7D6E]"
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
              <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                Thank You, {answers.name}!
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                We&apos;re searching our database for accident reports matching your criteria in{" "}
                <strong>{answers.city}, {answers.state}</strong>.
                You&apos;ll receive an email at <strong>{answers.email}</strong> with your
                personalized accident information shortly.
              </p>
            </div>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-[#2A7D6E] text-white rounded-xl hover:bg-[#236859] transition-colors font-medium"
            >
              Return Home
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-neutral-100 p-6 md:p-8 hover:shadow-[0_12px_50px_rgba(0,0,0,0.12)] transition-all duration-300">
        {/* Progress bar */}
        <div className="mb-4 flex items-center justify-between text-xs text-neutral-500">
          <span>Step {stepIndex + 1} of {totalSteps}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="mb-6 h-1.5 w-full rounded-full bg-neutral-100">
          <motion.div
            className="h-1.5 rounded-full bg-[#2A7D6E]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Main content */}
        <div className="min-h-[320px]">
          <AnimatePresence mode="wait">
            {!isSearching ? (
              <motion.div
                key={currentStepId}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 }}
                transition={{ duration: 0.25 }}
              >
                {currentStepId === "location" && (
                  <LocationStep
                    stateValue={answers.state ?? ""}
                    cityValue={answers.city ?? ""}
                    monthValue={answers.month ?? ""}
                    onStateChange={(v) => {
                      updateAnswer("state", v);
                      updateAnswer("city", ""); // Reset city when state changes
                    }}
                    onCityChange={(v) => updateAnswer("city", v)}
                    onMonthChange={(v) => updateAnswer("month", v)}
                  />
                )}
                {currentStepId === "involvement" && (
                  <InvolvementStep
                    value={answers.involvement}
                    onChange={(v) => updateAnswer("involvement", v)}
                  />
                )}
                {currentStepId === "medical" && (
                  <MedicalStep
                    value={answers.medical}
                    onChange={(v) => updateAnswer("medical", v)}
                  />
                )}
                {currentStepId === "lawyer" && (
                  <LawyerStep
                    value={answers.lawyer}
                    onChange={(v) => updateAnswer("lawyer", v)}
                  />
                )}
                {currentStepId === "name" && (
                  <NameStep
                    name={answers.name ?? ""}
                    surname={answers.surname ?? ""}
                    onNameChange={(v) => updateAnswer("name", v)}
                    onSurnameChange={(v) => updateAnswer("surname", v)}
                  />
                )}
                {currentStepId === "email" && (
                  <EmailStep
                    email={answers.email ?? ""}
                    onEmailChange={(v) => updateAnswer("email", v)}
                  />
                )}
              </motion.div>
            ) : (
              <SearchingAnimation stepId={currentStepId} />
            )}
          </AnimatePresence>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        {/* Navigation buttons */}
        {!isSearching && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0 || submitting}
              className="text-sm text-neutral-600 hover:text-neutral-900 disabled:opacity-40 transition-colors"
            >
              {stepIndex > 0 ? "← Back" : ""}
            </button>

            {currentStepId === "location" ? (
              <button
                type="button"
                onClick={goNext}
                disabled={submitting}
                className="bg-[#2A7D6E] text-white px-6 py-3.5 rounded-xl hover:bg-[#236859] transition-all font-medium shadow-sm disabled:opacity-60"
              >
                Search Accidents
              </button>
            ) : currentStepId !== "email" ? (
              <button
                type="button"
                onClick={goNext}
                disabled={submitting}
                className="bg-[#2A7D6E] text-white px-6 py-3.5 rounded-xl hover:bg-[#236859] transition-all font-medium shadow-sm disabled:opacity-60"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#2A7D6E] text-white px-6 py-3.5 rounded-xl hover:bg-[#236859] transition-all font-medium shadow-sm disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Send My Report"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Searching Animation ---------- */

function TransitionIcon({ type }: { type: TransitionCopy["icon"] }) {
  const iconClass = "w-8 h-8 text-[#2A7D6E]";

  switch (type) {
    case "location":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "person":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case "medical":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "legal":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      );
    case "profile":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    default:
      return null;
  }
}

function SearchingAnimation({ stepId }: { stepId: StepId }) {
  const transition = TRANSITIONS[stepId];

  return (
    <motion.div
      key={`searching-${stepId}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="flex h-[320px] flex-col items-center justify-center space-y-5 text-center px-4"
    >
      {/* Icon with animated ring */}
      <div className="relative">
        <motion.div
          className="w-20 h-20 bg-[#E8F5F2] rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <TransitionIcon type={transition.icon} />
        </motion.div>
        {/* Animated outer ring */}
        <motion.div
          className="absolute inset-0 w-20 h-20 rounded-full border-2 border-[#2A7D6E]"
          animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      </div>

      {/* Step-specific copy */}
      <div className="space-y-2">
        <motion.p
          className="text-xl font-semibold text-neutral-900"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {transition.title}
        </motion.p>
        <motion.p
          className="max-w-sm text-sm text-neutral-500 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {transition.body}
        </motion.p>
      </div>

      {/* Animated dots */}
      <div className="flex space-x-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-[#2A7D6E]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- Step 1: Location & Month ---------- */

type LocationStepProps = {
  stateValue: string;
  cityValue: string;
  monthValue: string;
  onStateChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onMonthChange: (v: string) => void;
};

function LocationStep({
  stateValue,
  cityValue,
  monthValue,
  onStateChange,
  onCityChange,
  onMonthChange,
}: LocationStepProps) {
  const cities = stateValue ? STATE_CITIES[stateValue] ?? [] : [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Find Information About Recent Traffic Accidents
        </h2>
        <p className="text-neutral-500">
          Search by location and date to find crashes in your area.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* State dropdown */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              State
            </label>
            <select
              value={stateValue}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all appearance-none bg-white cursor-pointer"
            >
              {STATE_OPTIONS.map((opt) => (
                <option key={opt.value || "blank"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* City dropdown */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              City
            </label>
            <select
              value={cityValue}
              onChange={(e) => onCityChange(e.target.value)}
              disabled={!stateValue}
              className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all appearance-none bg-white cursor-pointer disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
            >
              {!stateValue ? (
                <option value="">Select a state first</option>
              ) : (
                <>
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {/* Month picker */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Month of Accident{" "}
            <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <input
            type="month"
            value={monthValue}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all bg-white"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 2: Involvement ---------- */

type SimpleStepProps = {
  value?: string;
  onChange: (value: string) => void;
};

function InvolvementStep({ value = "", onChange }: SimpleStepProps) {
  const options = [
    { value: "injured", label: "I was injured in this accident" },
    { value: "involved_not_injured", label: "I was involved but not injured" },
    { value: "on_behalf", label: "I'm looking on behalf of someone else" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Were you involved or hurt in this accident?
        </h2>
        <p className="text-neutral-500">
          This helps us tailor what information we show and who we connect you with.
        </p>
      </div>
      <div className="space-y-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`w-full rounded-xl border-2 px-5 py-4 text-left font-medium transition-all ${
                selected
                  ? "border-[#2A7D6E] bg-[#E8F5F2] text-[#2A7D6E]"
                  : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 3: Medical ---------- */

function MedicalStep({ value = "", onChange }: SimpleStepProps) {
  const options = [
    { value: "yes_emergency", label: "Yes, emergency care (ambulance / ER)" },
    { value: "yes_doctor", label: "Yes, I saw a doctor later" },
    { value: "minor_no_care", label: "Minor pain, no doctor visit" },
    { value: "no_injuries", label: "No injuries reported" },
    { value: "unsure", label: "Not sure yet" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Did you require medical help?
        </h2>
        <p className="text-neutral-500">
          This doesn&apos;t create a medical record. It helps us understand the situation.
        </p>
      </div>
      <div className="space-y-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`w-full rounded-xl border-2 px-5 py-4 text-left font-medium transition-all ${
                selected
                  ? "border-[#2A7D6E] bg-[#E8F5F2] text-[#2A7D6E]"
                  : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 4: Lawyer ---------- */

function LawyerStep({ value = "", onChange }: SimpleStepProps) {
  const options = [
    { value: "no", label: "No, I do not have a lawyer" },
    { value: "yes", label: "Yes, I already have a lawyer" },
    { value: "just_looking", label: "I'm just looking for information" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Do you already have a lawyer for this accident?
        </h2>
        <p className="text-neutral-500">
          We can connect you with experienced personal injury attorneys if needed.
        </p>
      </div>
      <div className="space-y-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`w-full rounded-xl border-2 px-5 py-4 text-left font-medium transition-all ${
                selected
                  ? "border-[#2A7D6E] bg-[#E8F5F2] text-[#2A7D6E]"
                  : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 5: Name ---------- */

type NameStepProps = {
  name: string;
  surname: string;
  onNameChange: (v: string) => void;
  onSurnameChange: (v: string) => void;
};

function NameStep({ name, surname, onNameChange, onSurnameChange }: NameStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          What is your name?
        </h2>
        <p className="text-neutral-500">
          We&apos;ll use this to personalize your accident report.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            First name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all"
            placeholder="John"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Last name
          </label>
          <input
            type="text"
            value={surname}
            onChange={(e) => onSurnameChange(e.target.value)}
            className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all"
            placeholder="Smith"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 6: Email ---------- */

type EmailStepProps = {
  email: string;
  onEmailChange: (v: string) => void;
};

function EmailStep({ email, onEmailChange }: EmailStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Where should we send your report?
        </h2>
        <p className="text-neutral-500">
          We&apos;ll email you accident information matching your criteria and guide you on
          how to request your official police report. We don&apos;t sell your email address.
        </p>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2A7D6E]/20 focus:border-[#2A7D6E] transition-all"
          placeholder="you@example.com"
        />
      </div>
    </div>
  );
}

export default HomeAccidentWizard;
