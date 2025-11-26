"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STATE_OPTIONS, STATE_CITIES } from "@/lib/locationData";

type Answers = {
  when?: string;
  who?: string;
  medical?: string;
  state?: string;
  city?: string;
  name?: string;
  surname?: string;
  email?: string;
};

type Props = {
  onComplete?: (answers: Answers) => Promise<void> | void;
};

const STEP_IDS = [
  "when",
  "who",
  "medical",
  "location",
  "name",
  "email",
] as const;

type StepId = (typeof STEP_IDS)[number];

export function AccidentOnboardingWizard({ onComplete }: Props) {
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
    // validate current step
    if (currentStepId === "when") {
      if (!require(answers.when, "Please tell us when the accident happened.")) return;
    } else if (currentStepId === "who") {
      if (!require(answers.who, "Please tell us who was involved.")) return;
    } else if (currentStepId === "medical") {
      if (!require(answers.medical, "Please tell us if medical help was required.")) return;
    } else if (currentStepId === "location") {
      if (
        !require(answers.state, "Please select the state where the accident happened.") ||
        !require(answers.city, "Please select the city where the accident happened.")
      ) {
        return;
      }
    } else if (currentStepId === "name") {
      if (
        !require(answers.name, "Please enter your first name.") ||
        !require(answers.surname, "Please enter your last name.")
      ) {
        return;
      }
    }

    // show "searching database" animation between steps
    if (!isLastStep) {
      setIsSearching(true);
      // fake delay to make it feel like we're crunching data
      await new Promise((resolve) => setTimeout(resolve, 1100));
      setIsSearching(false);
    }

    if (!isLastStep) {
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

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        answers: {
          when: answers.when,
          who: answers.who,
          medical: answers.medical,
          state: answers.state,
          city: answers.city,
        },
        contact: {
          name: `${answers.name} ${answers.surname}`.trim(),
          email: answers.email,
          phone: null,
          details: null,
        },
        submittedAt: new Date().toISOString(),
      };

      if (onComplete) {
        await onComplete(answers);
      } else {
        const res = await fetch("/api/leads/accident-help", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Failed to submit");
        }
      }

      setIsComplete(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isComplete) {
    return (
      <div className="relative w-full max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You, {answers.name}!
            </h2>
            <p className="text-gray-600">
              We&apos;re searching our database for accident reports matching your criteria.
              You&apos;ll receive an email at <strong>{answers.email}</strong> with your
              personalized accident report shortly.
            </p>
          </div>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          Step {stepIndex + 1} of {totalSteps}
        </span>
        <span>{progress}% complete</span>
      </div>
      <div className="mb-6 h-1.5 w-full rounded-full bg-gray-100">
        <motion.div
          className="h-1.5 rounded-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content with animated transitions */}
      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          {!isSearching ? (
            <motion.div
              key={currentStepId}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.25 }}
            >
              {currentStepId === "when" && (
                <WhenStep value={answers.when} onChange={(v) => updateAnswer("when", v)} />
              )}
              {currentStepId === "who" && (
                <WhoStep value={answers.who} onChange={(v) => updateAnswer("who", v)} />
              )}
              {currentStepId === "medical" && (
                <MedicalStep
                  value={answers.medical}
                  onChange={(v) => updateAnswer("medical", v)}
                />
              )}
              {currentStepId === "location" && (
                <LocationStep
                  stateValue={answers.state ?? ""}
                  cityValue={answers.city ?? ""}
                  onStateChange={(v) => {
                    updateAnswer("state", v);
                    updateAnswer("city", ""); // reset city when state changes
                  }}
                  onCityChange={(v) => updateAnswer("city", v)}
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
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-[280px] flex-col items-center justify-center space-y-4 text-center"
            >
              {/* Animated spinner */}
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-3 border-gray-200 border-t-black" />
                <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-black opacity-20" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  Searching accident records...
                </p>
                <p className="max-w-xs text-sm text-gray-500">
                  We&apos;re scanning thousands of public accident reports and news sources
                  to find incidents that match your answers.
                </p>
              </div>
              {/* Animated dots */}
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-black"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Nav buttons */}
      {!isSearching && (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0 || submitting}
            className="text-sm text-gray-600 hover:text-black disabled:opacity-40 transition-colors"
          >
            {stepIndex > 0 ? "← Back" : ""}
          </button>

          {currentStepId !== "email" ? (
            <button
              type="button"
              onClick={goNext}
              disabled={submitting}
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Submitting..." : "Send My Report"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Individual steps ---------- */

type SimpleStepProps = {
  value?: string;
  onChange: (value: string) => void;
};

function WhenStep({ value = "", onChange }: SimpleStepProps) {
  const options = [
    { value: "24h", label: "Within the last 24 hours" },
    { value: "7d", label: "Within the last 7 days" },
    { value: "30d", label: "Within the last 30 days" },
    { value: "6m", label: "Within the last 6 months" },
    { value: "older", label: "More than 6 months ago" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        When did the accident happen?
      </h2>
      <p className="text-gray-500">
        An approximate time frame is fine. This helps us find the right reports.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                selected
                  ? "border-black bg-gray-50 text-black"
                  : "border-gray-200 hover:border-gray-400 text-gray-700"
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

function WhoStep({ value = "", onChange }: SimpleStepProps) {
  const options = [
    { value: "me_driver", label: "I was the driver" },
    { value: "me_passenger", label: "I was a passenger" },
    { value: "pedestrian", label: "I was a pedestrian or cyclist" },
    { value: "family", label: "A family member or loved one" },
    { value: "company_vehicle", label: "Commercial vehicle (FedEx, UPS, etc.)" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Who was involved in the accident?
      </h2>
      <p className="text-gray-500">
        We&apos;ll use this to tailor what information we show and who we connect you with.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                selected
                  ? "border-black bg-gray-50 text-black"
                  : "border-gray-200 hover:border-gray-400 text-gray-700"
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

function MedicalStep({ value = "", onChange }: SimpleStepProps) {
  const options = [
    { value: "yes_emergency", label: "Yes, emergency care (ambulance / ER)" },
    { value: "yes_doctor", label: "Yes, I saw a doctor later" },
    { value: "minor_no_care", label: "Minor pain, no doctor visit" },
    { value: "no_injuries", label: "No injuries reported" },
    { value: "unsure", label: "Not sure yet" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Did you require medical help?
      </h2>
      <p className="text-gray-500">
        This doesn&apos;t create a medical record. It helps us understand the situation.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                selected
                  ? "border-black bg-gray-50 text-black"
                  : "border-gray-200 hover:border-gray-400 text-gray-700"
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

type LocationStepProps = {
  stateValue: string;
  cityValue: string;
  onStateChange: (v: string) => void;
  onCityChange: (v: string) => void;
};

function LocationStep({
  stateValue,
  cityValue,
  onStateChange,
  onCityChange,
}: LocationStepProps) {
  const cities = stateValue ? STATE_CITIES[stateValue] ?? [] : [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Where did the accident happen?
      </h2>
      <p className="text-gray-500">
        First choose the state, then select the city to narrow down results.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            State
          </label>
          <select
            value={stateValue}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none transition-colors"
          >
            {STATE_OPTIONS.map((opt) => (
              <option key={opt.value || "blank"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            City
          </label>
          <select
            value={cityValue}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={!stateValue}
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm disabled:bg-gray-100 disabled:text-gray-400 focus:border-black focus:outline-none transition-colors"
          >
            {!stateValue && <option value="">Select a state first</option>}
            {stateValue && (
              <>
                <option value="">Select a city</option>
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
    </div>
  );
}

type NameStepProps = {
  name: string;
  surname: string;
  onNameChange: (v: string) => void;
  onSurnameChange: (v: string) => void;
};

function NameStep({ name, surname, onNameChange, onSurnameChange }: NameStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        What is your name?
      </h2>
      <p className="text-gray-500">
        We&apos;ll use this to personalize your accident report.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none transition-colors"
            placeholder="John"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Last name
          </label>
          <input
            type="text"
            value={surname}
            onChange={(e) => onSurnameChange(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none transition-colors"
            placeholder="Smith"
          />
        </div>
      </div>
    </div>
  );
}

type EmailStepProps = {
  email: string;
  onEmailChange: (v: string) => void;
};

function EmailStep({ email, onEmailChange }: EmailStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Where should we send your report?
      </h2>
      <p className="text-gray-500">
        We&apos;ll email you a summary of matching accident reports and next steps.
        We don&apos;t sell your email address.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-sm focus:border-black focus:outline-none transition-colors"
          placeholder="you@example.com"
        />
      </div>
    </div>
  );
}

export default AccidentOnboardingWizard;
