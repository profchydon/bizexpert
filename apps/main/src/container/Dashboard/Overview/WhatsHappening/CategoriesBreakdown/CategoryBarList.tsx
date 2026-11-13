interface CategoryBarEntry {
  label: string;
  value: number;
}

export function categoryBarFillPercent(value: number, max: number) {
  return (value / Math.max(1, max)) * 100;
}

export function CategoryBarList({ data }: { data: CategoryBarEntry[] }) {
  const max = Math.max(1, ...data.map((entry) => entry.value));

  return (
    <div className="flex w-full flex-col gap-3">
      {data.map((entry) => (
        <div key={entry.label}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-tertiary">{entry.label}</span>
            <span className="font-medium text-primary">{entry.value}</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-md bg-quaternary">
            <div
              className="h-full rounded-md transition-all duration-300"
              style={{
                width: `${categoryBarFillPercent(entry.value, max)}%`,
                backgroundColor: "var(--color-utility-brand-600)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
