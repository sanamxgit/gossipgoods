import { CheckCircle } from "lucide-react"

interface CheckoutStepsProps {
  currentStep: number
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: 1, name: "Shipping" },
    { id: 2, name: "Payment" },
    { id: 3, name: "Confirmation" },
  ]

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step.id <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.id < currentStep ? <CheckCircle className="w-6 h-6" /> : <span>{step.id}</span>}
          </div>
          <div className={`ml-2 text-sm font-medium ${step.id <= currentStep ? "text-gray-900" : "text-gray-400"}`}>
            {step.name}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-24 h-1 mx-4 ${steps[index + 1].id <= currentStep ? "bg-primary" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
