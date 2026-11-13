import Link from "next/link";

interface Props {
  entityName: string;
  count: number;
  noun: string;
  clearHref: string;
}

export function EntityFilterBanner({
  entityName,
  count,
  noun,
  clearHref,
}: Props) {
  const pluralNoun = count === 1 ? noun : `${noun}s`;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-sm text-gray-600">
        Showing {count} {pluralNoun} for{" "}
        <span className="font-medium text-gray-900">{entityName}</span>.
      </p>
      <Link
        href={clearHref}
        className="shrink-0 text-sm font-semibold text-primary-700 hover:underline"
      >
        Show all
      </Link>
    </div>
  );
}
