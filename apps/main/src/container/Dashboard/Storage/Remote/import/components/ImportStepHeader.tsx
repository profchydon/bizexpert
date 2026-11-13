"use client";

import { Check } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import { cx } from "@/utils/cx";

const LABELS = ["Country", "Add devices", "Collection", "Review"];

interface Props {
  step: number;
  onStepClick?: (index: number) => void;
}

export function ImportStepHeader({ step, onStepClick }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold tracking-wide text-tertiary uppercase">
        Step {step + 1} of {LABELS.length}
      </p>

      {/* Mobile: current step name + a compact segmented progress bar (the numbered
          stepper spreads too thin without its labels on small screens). */}
      <div className="flex flex-col gap-2 sm:hidden">
        <p className="text-sm font-medium text-primary">{LABELS[step]}</p>
        <div className="flex gap-1.5">
          {LABELS.map((label, i) => (
            <span
              key={label}
              className={cx(
                "h-1.5 flex-1 rounded-full transition",
                i <= step ? "bg-brand-solid" : "bg-secondary",
              )}
            />
          ))}
        </div>
      </div>

      <ol className="hidden items-center sm:flex">
        {LABELS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          const clickable = done && !!onStepClick;
          const last = i === LABELS.length - 1;
          return (
            <li
              key={label}
              className={cx("flex items-center", !last && "flex-1")}
            >
              <AriaButton
                isDisabled={!clickable}
                onPress={() => onStepClick?.(i)}
                className={cx(
                  "flex items-center gap-2 rounded-lg outline-hidden",
                  clickable && "cursor-pointer",
                )}
              >
                <span
                  className={cx(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                    done || current
                      ? "bg-brand-solid text-white"
                      : "bg-secondary text-quaternary",
                    current && "ring-2 ring-brand-200",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span
                  className={cx(
                    "hidden text-sm font-medium transition sm:block",
                    current
                      ? "text-primary"
                      : done
                        ? "text-secondary"
                        : "text-quaternary",
                  )}
                >
                  {label}
                </span>
              </AriaButton>
              {!last && (
                <span
                  className={cx(
                    "mx-2 h-0.5 flex-1 rounded-full transition",
                    done ? "bg-brand-solid" : "bg-secondary",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
