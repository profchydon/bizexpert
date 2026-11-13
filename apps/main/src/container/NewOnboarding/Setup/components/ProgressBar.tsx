import { cn } from "@/lib/utils";

export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1 flex-1 rounded-full transition-all duration-300",
            index < current
              ? "bg-primary-600"
              : index === current
                ? "bg-primary-300"
                : "bg-gray-200",
          )}
        />
      ))}
    </div>
  );
}
