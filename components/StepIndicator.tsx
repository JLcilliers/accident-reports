interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Accident Details" },
    { number: 2, label: "Contact Info" },
    { number: 3, label: "Report Status" },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step.number === currentStep
                  ? "bg-blue-600 text-white"
                  : step.number < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <span className="text-sm mt-2 text-gray-600">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-24 h-1 mx-4 ${
                step.number < currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
