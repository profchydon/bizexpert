import { cn } from "@/lib/utils";

interface Props {
  selected: boolean;
  className?: string;
}

export function WizardRadioIndicator({ selected, className }: Props) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition",
        selected ? "bg-primary-600 ring-primary-600" : "bg-white ring-gray-300",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full bg-white transition-opacity",
          selected ? "opacity-100" : "opacity-0",
        )}
      />
    </span>
  );
}
