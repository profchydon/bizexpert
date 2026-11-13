import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PreFlightCheck } from "../types";
import {
  preflightCheckBlockedClass,
  preflightCheckFailIconClass,
  preflightCheckFailLabelClass,
  preflightCheckListClass,
  preflightCheckPassIconClass,
  preflightCheckPassLabelClass,
  preflightCheckRowClass,
} from "./preflightModalClasses";

interface Props {
  checks: PreFlightCheck[];
}

export function PreFlightCheckList({ checks }: Props) {
  return (
    <ul className={preflightCheckListClass}>
      {checks.map((check) => (
        <li key={check.label} className={preflightCheckRowClass}>
          {check.ok ? (
            <CheckCircle aria-hidden className={preflightCheckPassIconClass} />
          ) : (
            <AlertCircle aria-hidden className={preflightCheckFailIconClass} />
          )}
          <div>
            <p
              className={cn(
                check.ok
                  ? preflightCheckPassLabelClass
                  : preflightCheckFailLabelClass,
              )}
            >
              {check.label}
            </p>
            {!check.ok && check.blocked && (
              <p className={preflightCheckBlockedClass}>{check.blocked}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
