import type { DonatedDevice } from "../types/storage";

const RECIPIENT_LABEL: Record<DonatedDevice["recipientType"], string> = {
  ngo: "NGOs",
  school: "Schools",
  individual: "Individuals",
};

function tally(
  items: DonatedDevice[],
  key: (d: DonatedDevice) => string,
): [string, number][] {
  const map = new Map<string, number>();
  for (const d of items) map.set(key(d), (map.get(key(d)) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function Group({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-xl border border-secondary bg-primary p-5">
      <p className="text-sm font-medium text-secondary">{title}</p>
      <div className="flex flex-col gap-1.5">
        {rows.map(([label, count]) => (
          <div
            key={label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-tertiary">{label}</span>
            <span className="font-semibold text-primary">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImpactBreakdown({ donated }: { donated: DonatedDevice[] }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Group
        title="By recipient type"
        rows={tally(donated, (d) => RECIPIENT_LABEL[d.recipientType])}
      />
      <Group title="By country" rows={tally(donated, (d) => d.country)} />
    </div>
  );
}
