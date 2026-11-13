import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-slate-50 hover:bg-slate-900/90 focus-visible:ring-slate-950/30 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300/30",
        destructive:
          "bg-error-500 text-white hover:bg-error-500/90 focus-visible:ring-error-500/30 dark:bg-error-900 dark:text-slate-50 dark:hover:bg-error-900/90",
        outline:
          "border border-gray-200 bg-white text-base focus-visible:ring-gray-300",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 focus-visible:ring-slate-400/30 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline focus-visible:ring-transparent dark:text-slate-50",
        primary:
          "border border-primary-600 bg-primary-600 text-base font-semibold normal-case text-white hover:bg-primary-700 focus-visible:ring-primary-600/35",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-md px-8",
        md: "rounded-lg h-[44px] px-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const classNames = cn(
      buttonVariants({ variant, size, className }),
      isLoading && "disabled:opacity-100",
    );

    if (asChild) {
      return (
        <Slot className={classNames} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={classNames}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <Loader2
            className="mr-2 size-4 shrink-0 animate-spin text-current"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
