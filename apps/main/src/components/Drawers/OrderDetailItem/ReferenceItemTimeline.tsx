import React from "react";
import { Check } from "lucide-react";
import { ItemHistoryStep } from "./itemSlideoutData";

const ReferenceItemTimeline: React.FC<{ steps: ItemHistoryStep[] }> = ({
  steps,
}) => {
  if (steps.length === 0) {
    return (
      <p className="text-sm text-gray-500">No history is available yet.</p>
    );
  }

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-3">
          <div className="flex flex-col items-center pb-1">
            {step.current ? (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-600 ring-4 ring-primary-100">
                <div className="size-2 rounded-full bg-white" />
              </div>
            ) : (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                <Check className="size-3.5" />
              </div>
            )}
            {index < steps.length - 1 && (
              <div
                className="w-0.5 flex-1 rounded-full bg-primary-600"
                style={{ minHeight: 28 }}
              />
            )}
          </div>
          <div className="flex flex-col gap-0.5 pt-0.5 pb-6">
            <p
              className={`text-sm font-semibold ${step.current ? "text-primary-700" : "text-gray-700"}`}
            >
              {step.label}
            </p>
            <p
              className={`text-sm ${step.current ? "text-primary-600" : "text-gray-500"}`}
            >
              {step.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReferenceItemTimeline;
