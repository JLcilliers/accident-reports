interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Accident Details", shortLabel: "Details" },
    { number: 2, label: "Contact Info", shortLabel: "Contact" },
    { number: 3, label: "Report Status", shortLabel: "Status" },
  ];

  return (
    <div className="flex items-center justify-center mb-8 px-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                step.number === currentStep
                  ? "bg-blue-600 text-white"
                  : step.number < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <span className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-600 text-center max-w-[60px] sm:max-w-none">
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.shortLabel}</span>
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 md:w-24 h-1 mx-2 sm:mx-4 ${
                step.number < currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
