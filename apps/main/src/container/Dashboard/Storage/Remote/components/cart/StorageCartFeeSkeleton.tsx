import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClass = {
  sm: "h-4 w-12",
  md: "h-5 w-16",
  lg: "h-7 w-20",
} as const;

export function StorageCartFeeSkeleton({ className, size = "sm" }: Props) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block animate-pulse rounded bg-secondary",
        sizeClass[size],
        className,
      )}
    />
  );
}
