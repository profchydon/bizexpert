interface Segment {
  key: string;
  label: string;
  count: number;
  colorClass: string;
}

interface Props {
  segments: Segment[];
  total: number;
}

export function AssetMixBar({ segments, total }: Props) {
  if (segments.length === 0 || total === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className={`${segment.colorClass} h-full`}
            style={{ width: `${(segment.count / total) * 100}%` }}
            title={`${segment.label} — ${segment.count} of ${total}`}
          />
        ))}
      </div>
      <ul className="-mx-2 flex flex-wrap gap-x-1 gap-y-0.5">
        {segments.map((segment) => (
          <li
            key={segment.key}
            className="flex items-center gap-1.5 rounded-md px-2 py-1"
          >
            <span className={`size-2 rounded-full ${segment.colorClass}`} />
            <span className="text-xs text-gray-600">{segment.label}</span>
            <span className="text-xs font-semibold text-gray-700">
              {segment.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
