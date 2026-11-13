import { cn } from "@/lib/utils";

type Tone = "blue" | "orange" | "green" | "gray" | "slate" | "purple";

const toneStyles: Record<Tone, string> = {
  blue: "border-primary-200 bg-primary-50 text-primary-700",
  orange: "border-warning-200 bg-warning-50 text-warning-700",
  green: "border-success-200 bg-success-50 text-success-700",
  gray: "border-gray-200 bg-gray-50 text-gray-700",
  slate: "border-gray-200 bg-gray-50 text-gray-700",
  purple: "border-purple-50 bg-purple-50 text-purple-700",
};

interface KitPillProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

const KitPill = ({ children, tone = "gray", className }: KitPillProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};

export default KitPill;
