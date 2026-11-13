import {
  Calendar,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  Package,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";

interface Step {
  icon: LucideIcon;
  label: string;
  desc: string;
}

const VERIFICATION_STEPS: Step[] = [
  {
    icon: Mail,
    label: "Verification email sent",
    desc: "Secure link sent to employee's email",
  },
  {
    icon: ClipboardCheck,
    label: "Delivery info confirmed",
    desc: "Employee verified address and phone",
  },
  {
    icon: ShieldCheck,
    label: "Documents verified",
    desc: "Identity and delivery docs approved",
  },
  {
    icon: Truck,
    label: "Ready to ship",
    desc: "Order dispatched to fulfilment",
  },
];

export const OFFICE_VERIFICATION_STEPS: Step[] = [
  {
    icon: Mail,
    label: "Verification email sent",
    desc: "Secure link sent to the office contact's email",
  },
  {
    icon: ClipboardCheck,
    label: "Delivery info confirmed",
    desc: "Contact confirmed the office address & phone",
  },
  {
    icon: ShieldCheck,
    label: "Documents verified",
    desc: "Identity and delivery docs approved",
  },
  {
    icon: Truck,
    label: "Ready to ship",
    desc: "Order dispatched to the office",
  },
];

const RETRIEVAL_STEPS: Step[] = [
  {
    icon: Calendar,
    label: "Retrieval scheduled",
    desc: "Pickup arranged with the employee",
  },
  {
    icon: Package,
    label: "Device collected",
    desc: "Equipment picked up for processing",
  },
  {
    icon: ClipboardCheck,
    label: "Device check completed",
    desc: "Inspected on retrieval — condition recorded",
  },
  {
    icon: ShieldCheck,
    label: "Data wipe completed",
    desc: "Secure erasure / destruction certificate issued",
  },
  {
    icon: CheckCircle2,
    label: "Off-boarding complete",
    desc: "Stored, reassigned, or disposed",
  },
];

const getCompletedSteps = (status: string | undefined, total: number) => {
  const normalized = status?.toLowerCase();
  if (
    normalized === "completed" ||
    normalized === "order_delivered" ||
    normalized === "collection_completed" ||
    normalized === "picked_up"
  ) {
    return total;
  }
  if (normalized === "in_progress") return 2;
  return 1;
};

export function verificationStepsFor(
  isOffboarding?: boolean,
  isOffice?: boolean,
): Step[] {
  if (isOffboarding) return RETRIEVAL_STEPS;
  return isOffice ? OFFICE_VERIFICATION_STEPS : VERIFICATION_STEPS;
}

export const ReferenceVerificationProgress = ({
  status,
  isOffboarding,
  isOffice,
}: {
  status?: string;
  isOffboarding?: boolean;
  isOffice?: boolean;
}) => {
  const steps = verificationStepsFor(isOffboarding, isOffice);
  const completedSteps = getCompletedSteps(status, steps.length);

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, index) => {
        const done = index < completedSteps;
        const active = index === completedSteps;
        const Icon = done ? CheckCheck : step.icon;
        let stepTone = "bg-gray-50 text-gray-300";
        let textTone = "text-gray-500";
        if (done) {
          stepTone = "bg-success-50 text-success-700";
          textTone = "text-success-700";
        } else if (active) {
          stepTone = "bg-primary-25 text-primary-700";
          textTone = "text-primary-700";
        }

        return (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${stepTone}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 flex-1 ${done ? "bg-success-200" : "bg-gray-200"}`}
                  style={{ minHeight: 20 }}
                />
              )}
            </div>
            <div className="pb-4">
              <p className={`text-sm font-medium ${textTone}`}>{step.label}</p>
              <p className="text-xs text-gray-500">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
