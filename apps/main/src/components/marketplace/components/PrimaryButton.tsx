import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<Required<PrimaryButtonProps>["size"], string> = {
  sm: "mp-h-9 mp-px-3 mp-py-2 mp-text-sm",
  md: "mp-h-10 mp-px-3.5 mp-py-2.5 mp-text-sm",
  lg: "mp-h-11 mp-px-4 mp-py-2.5 mp-text-base",
};

/**
 * Minimal, dependency-free button styled entirely through CSS variables
 * (`--mp-primary`, `--mp-primary-foreground`, `--mp-radius`), so it doesn't
 * pull in either consumer's shadcn `Button`. Consumers theme it by setting
 * those variables (see `styles.css`), the same way partner-frontend already
 * themes its embeddable marketplace.
 */
export const PrimaryButton = ({
  size = "md",
  className,
  type = "button",
  ...props
}: PrimaryButtonProps) => (
  <button
    type={type}
    className={cn(
      "mp-inline-flex mp-items-center mp-justify-center mp-gap-2 mp-font-semibold mp-transition disabled:mp-cursor-not-allowed disabled:mp-opacity-60",
      "mp-bg-[var(--mp-primary,#085DE8)] mp-text-[var(--mp-primary-foreground,#fff)] hover:mp-bg-[var(--mp-primary-hover,#0948B5)]",
      "mp-rounded-[var(--mp-radius,0.5rem)]",
      SIZE_CLASSES[size],
      className,
    )}
    {...props}
  />
);

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const IconButton = ({
  className,
  type = "button",
  ...props
}: IconButtonProps) => (
  <button
    type={type}
    className={cn(
      "mp-inline-flex mp-items-center mp-justify-center mp-rounded-full mp-border mp-border-gray-300 mp-bg-white mp-text-gray-700 mp-transition hover:mp-bg-gray-50 disabled:mp-cursor-not-allowed disabled:mp-opacity-60",
      className,
    )}
    {...props}
  />
);
