import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        destructive: "border-0 bg-error-50 text-error-700",
        outline: "text-gray-950 dark:text-gray-50",
        success:
          "border-0 text-success-700 bg-success-50 border-0 dark:text-gray-50",
        success_border:
          "text-success-700 bg-success-50 border-success-700 dark:text-gray-50",
        pending: "border-0 text-warning-700 bg-warning-50 dark:text-gray-50",
        awaiting: "border-0 text-purple-700 bg-purple-50 dark:text-gray-50",
        awaiting_border:
          "border-purple-700 text-purple-700 bg-purple-50 dark:text-gray-50",
        blue: "border-0 text-primary-700 bg-primary-50 dark:text-gray-50",
        blue_border:
          "border-primary-700 text-primary-700 bg-primary-50 dark:text-gray-50",
        mild: "border-0 bg-primary-25 dark:text-gray-50 text-primary-700",
        error: "border-0 bg-error-50 text-error-700 dark:text-error-50",
        gray: "border-0 bg-gray-100 dark:text-gray-50 text-gray-600",
        gray_border:
          "border-gray-600 bg-gray-100 dark:text-gray-50 text-gray-600",
        red: "border-0 bg-error-50 dark:text-gray-50 text-error-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: Readonly<BadgeProps>) {
  return (
    <span className={cn(className, badgeVariants({ variant }))} {...props} />
  );
}

export { Badge, badgeVariants };
