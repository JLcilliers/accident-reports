"use client";

import { useState } from "react";

type Option = {
  value: string;
  label: string;
  description?: string;
};

type Question =
  | {
      id: string;
      label: string;
      helperText?: string;
      type: "single"; // rendered as pill buttons
      options: Option[];
      required?: boolean;
    }
  | {
      id: string;
      label: string;
      helperText?: string;
      type: "select"; // rendered as <select>
      options: Option[];
      required?: boolean;
    };

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 25 }, (_, i) => CURRENT_YEAR - i);

const QUESTIONS: Question[] = [
  {
    id: "who",
    label: "Who is this accident information for?",
    helperText: "This helps us understand your situation.",
    type: "single",
    required: true,
    options: [
      { value: "injured", label: "I was injured" },
      { value: "driver_only_property", label: "I was the driver (property damage only)" },
      { value: "family_member", label: "Family member or loved one" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "accidentType",
    label: "What type of accident was it?",
    type: "single",
    required: true,
    options: [
      { value: "car", label: "Car crash" },
      { value: "truck_commercial", label: "Truck / commercial vehicle (FedEx, UPS, etc.)" },
      { value: "motorcycle", label: "Motorcycle crash" },
      { value: "pedestrian", label: "Pedestrian struck" },
      { value: "bicycle", label: "Bicycle crash" },
      { value: "other_vehicle", label: "Other type of vehicle" },
    ],
  },
  {
    id: "state",
    label: "Where did the accident happen?",
    helperText: "Select the state where the crash occurred.",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select a state" },
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
    ],
  },
  {
    id: "accidentDateBucket",
    label: "When did the accident happen?",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select a time frame" },
      { value: "24h", label: "Within the last 24 hours" },
      { value: "7d", label: "Within the last 7 days" },
      { value: "30d", label: "Within the last 30 days" },
      { value: "6m", label: "Within the last 6 months" },
      { value: "older", label: "More than 6 months ago" },
    ],
  },
  {
    id: "accidentYear",
    label: "What year did the accident happen?",
    helperText: "An approximate year is fine if you're not sure of the exact date.",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select year" },
      ...YEARS.map((y) => ({ value: String(y), label: String(y) })),
    ],
  },
  {
    id: "injurySeverity",
    label: "Were there any injuries?",
    type: "single",
    required: true,
    options: [
      { value: "no_injuries", label: "No injuries reported" },
      { value: "minor", label: "Minor injuries" },
      { value: "serious", label: "Serious injuries" },
      { value: "fatality", label: "Fatality / loss of life" },
      { value: "unsure", label: "Not sure yet" },
    ],
  },
  {
    id: "hasLawyer",
    label: "Do you already have a lawyer for this accident?",
    type: "single",
    required: true,
    options: [
      { value: "no", label: "No, I do not have a lawyer" },
      { value: "yes", label: "Yes, I already have a lawyer" },
      { value: "just_info", label: "I'm just looking for information" },
    ],
  },
];

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  details: string;
}

export default function GetHelpWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<ContactInfo>({
    name: "",
    phone: "",
    email: "",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = QUESTIONS.length + 1; // questions + contact step
  const progress = ((step + 1) / totalSteps) * 100;

  const currentQuestion = QUESTIONS[step];
  const isContactStep = step >= QUESTIONS.length;

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    // Auto-advance for single-select questions
    if (currentQuestion.type === "single") {
      setTimeout(() => setStep((s) => s + 1), 200);
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        answers,
        contact: {
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          details: contact.details || null,
        },
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/leads/accident-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setIsComplete(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
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
            Thank You!
          </h2>
          <p className="text-gray-600">
            We&apos;ve received your information. A member of our team will reach
            out to you shortly to discuss your case.
          </p>
        </div>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question or Contact step */}
      {isContactStep ? (
        <ContactStep
          contact={contact}
          setContact={setContact}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <QuestionStep
          question={currentQuestion}
          value={answers[currentQuestion.id] || ""}
          onSelect={handleSelect}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={step === 0}
        />
      )}
    </div>
  );
}

function QuestionStep({
  question,
  value,
  onSelect,
  onNext,
  onBack,
  isFirst,
}: {
  question: Question;
  value: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{question.label}</h2>
      {question.helperText && (
        <p className="text-gray-500 mb-6">{question.helperText}</p>
      )}

      {question.type === "single" && (
        <div className="space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all ${
                value === opt.value
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.description && (
                <span className="block text-sm text-gray-500 mt-1">
                  {opt.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {question.type === "select" && (
        <div className="mb-6">
          <select
            value={value}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-lg"
          >
            {question.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {!isFirst ? (
          <button
            onClick={onBack}
            className="px-6 py-3 text-gray-600 hover:text-black transition-colors"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {question.type === "select" && (
          <button
            onClick={onNext}
            disabled={!value}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}

function ContactStep({
  contact,
  setContact,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  contact: ContactInfo;
  setContact: React.Dispatch<React.SetStateAction<ContactInfo>>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const isValid = contact.name.trim() && (contact.phone.trim() || contact.email.trim());

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        How can we reach you?
      </h2>
      <p className="text-gray-500 mb-6">
        Enter your contact information so we can connect you with help.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={contact.name}
            onChange={(e) =>
              setContact((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="John Smith"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) =>
              setContact((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="(555) 123-4567"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) =>
              setContact((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="you@example.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details (optional)
          </label>
          <textarea
            value={contact.details}
            onChange={(e) =>
              setContact((prev) => ({ ...prev, details: e.target.value }))
            }
            placeholder="Tell us more about your situation..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none resize-none"
          />
        </div>

        <p className="text-sm text-gray-500">
          <span className="text-red-500">*</span> Please provide at least a phone
          number or email address.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 hover:text-black transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Get Help Now"}
        </button>
      </div>
    </div>
  );
}
