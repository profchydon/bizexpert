import { cn } from "../utils/cn";

export interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  "aria-label"?: string;
}

export const ToggleSwitch = ({
  checked,
  onCheckedChange,
  ...props
}: ToggleSwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "mp-relative mp-inline-flex mp-h-6 mp-w-10 mp-shrink-0 mp-items-center mp-rounded-full mp-transition-colors",
      checked ? "mp-bg-[var(--mp-primary,#085DE8)]" : "mp-bg-gray-200",
    )}
    {...props}
  >
    <span
      className={cn(
        "mp-inline-block mp-h-4 mp-w-4 mp-rounded-full mp-bg-white mp-shadow mp-transition-transform",
        checked ? "mp-translate-x-5" : "mp-translate-x-1",
      )}
    />
  </button>
);
