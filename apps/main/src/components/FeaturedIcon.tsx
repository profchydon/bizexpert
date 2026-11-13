import type { ComponentType, ReactNode, Ref } from "react";
import { isValidElement } from "react";
import { cn } from "@/lib/utils";

const iconsSizes = {
  sm: "*:data-icon:size-4",
  md: "*:data-icon:size-5",
  lg: "*:data-icon:size-6",
  xl: "*:data-icon:size-7",
};

const styles = {
  light: {
    base: "rounded-full",
    sizes: {
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
      xl: "size-14",
    },
    colors: {
      brand: "bg-primary-50 text-primary-600",
      gray: "bg-gray-100 text-gray-600",
      error: "bg-error-50 text-error-600",
      warning: "bg-warning-50 text-warning-600",
      success: "bg-success-50 text-success-600",
    },
  },

  gradient: {
    base: "rounded-full text-[var(--color-fg-white)] before:absolute before:inset-0 before:size-full before:rounded-full before:border after:absolute after:block after:rounded-full",
    sizes: {
      sm: "size-8 after:size-6 *:data-icon:size-4",
      md: "size-10 after:size-7 *:data-icon:size-4",
      lg: "size-12 after:size-8 *:data-icon:size-5",
      xl: "size-14 after:size-10 *:data-icon:size-5",
    },
    colors: {
      brand:
        "before:border-primary-200 before:bg-primary-50 after:bg-primary-600",
      gray: "before:border-gray-200 before:bg-gray-50 after:bg-gray-600",
      error: "before:border-error-200 before:bg-error-50 after:bg-error-600",
      warning:
        "before:border-warning-200 before:bg-warning-50 after:bg-warning-600",
      success:
        "before:border-success-200 before:bg-success-50 after:bg-success-600",
    },
  },

  dark: {
    base: "text-[var(--color-fg-white)] shadow-[var(--shadow-xs-skeumorphic)] before:absolute before:inset-px before:border before:border-white/10",
    sizes: {
      sm: "size-8 rounded-md before:rounded-[5px]",
      md: "size-10 rounded-lg before:rounded-[7px]",
      lg: "size-12 rounded-[10px] before:rounded-[9px]",
      xl: "size-14 rounded-xl before:rounded-[11px]",
    },
    colors: {
      brand: "bg-primary-600 before:border-primary-200",
      gray: "bg-gray-600 before:border-gray-200",
      error: "bg-error-600 before:border-error-200",
      warning: "bg-warning-600 before:border-warning-200",
      success: "bg-success-600 before:border-success-200",
    },
  },

  modern: {
    base: "bg-white shadow-[var(--shadow-xs-skeumorphic)] ring-1 ring-inset ring-gray-200",
    sizes: {
      sm: "size-8 rounded-md",
      md: "size-10 rounded-lg",
      lg: "size-12 rounded-[10px]",
      xl: "size-14 rounded-xl",
    },
    colors: {
      brand: "text-primary-600 ring-primary-200",
      gray: "text-gray-600 ring-gray-200",
      error: "text-error-600 ring-error-200",
      warning: "text-warning-600 ring-warning-200",
      success: "text-success-600 ring-success-200",
    },
  },
  "modern-neue": {
    base: [
      "bg-white ring-1 ring-inset ring-gray-200 before:absolute before:inset-1",
      // Shadow
      "before:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1),0px_3px_3px_0px_rgba(0,0,0,0.09),1px_8px_5px_0px_rgba(0,0,0,0.05),2px_21px_6px_0px_rgba(0,0,0,0),0px_0px_0px_1px_rgba(0,0,0,0.08),1px_13px_5px_0px_rgba(0,0,0,0.01),0px_-2px_2px_0px_rgba(0,0,0,0.13)_inset] before:ring-1 before:ring-gray-200",
    ].join(" "),
    sizes: {
      sm: "size-8 rounded-[8px] before:rounded-[4px]",
      md: "size-10 rounded-[10px] before:rounded-[6px]",
      lg: "size-12 rounded-[12px] before:rounded-[8px]",
      xl: "size-14 rounded-[14px] before:rounded-[10px]",
    },
    colors: {
      brand: "text-primary-600 ring-primary-200 before:ring-primary-200",
      gray: "text-gray-600 ring-gray-200 before:ring-gray-200",
      error: "text-error-600 ring-error-200 before:ring-error-200",
      warning: "text-warning-600 ring-warning-200 before:ring-warning-200",
      success: "text-success-600 ring-success-200 before:ring-success-200",
    },
  },

  outline: {
    base: "before:absolute before:rounded-full before:border-2 after:absolute after:rounded-full after:border-2",
    sizes: {
      sm: "size-4 before:size-6 after:size-[2.125rem]",
      md: "size-5 before:size-7 after:size-[2.375rem]",
      lg: "size-6 before:size-8 after:size-[2.625rem]",
      xl: "size-7 before:size-9 after:size-[2.875rem]",
    },
    colors: {
      brand:
        "text-primary-600 before:border-primary-600 after:border-primary-600",
      gray: "text-gray-600 before:border-gray-600 after:border-gray-600",
      error: "text-error-600 before:border-error-600 after:border-error-600",
      warning:
        "text-warning-600 before:border-warning-600 after:border-warning-600",
      success:
        "text-success-600 before:border-success-600 after:border-success-600",
    },
  },
} as const;

interface FeaturedIconProps {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
  icon?:
    | ComponentType<{ className?: string; "data-icon"?: boolean }>
    | ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  color: "brand" | "gray" | "success" | "warning" | "error";
  theme?: "light" | "gradient" | "dark" | "outline" | "modern" | "modern-neue";
}

export const FeaturedIcon = (props: FeaturedIconProps) => {
  const {
    size = "sm",
    theme: variant = "light",
    color = "brand",
    icon: Icon,
    ...otherProps
  } = props;
  const IconComponent =
    Icon &&
    !isValidElement(Icon) &&
    (typeof Icon === "function" || typeof Icon === "object")
      ? (Icon as ComponentType<{ className?: string; "data-icon"?: boolean }>)
      : null;

  return (
    <div
      {...otherProps}
      data-featured-icon
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        iconsSizes[size],
        styles[variant].base,
        styles[variant].sizes[size],
        styles[variant].colors[color],
        props.className,
      )}
    >
      {IconComponent && <IconComponent data-icon className="z-10" />}
      {isValidElement(Icon) && <div className="z-10">{Icon}</div>}

      {props.children}
    </div>
  );
};
