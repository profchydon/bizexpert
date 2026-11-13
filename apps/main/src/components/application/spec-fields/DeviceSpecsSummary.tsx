import {
  type SpecValues,
  enumerateSpecLabels,
  getSchemaIdForAssetType,
} from "@/lib/spec-schema";

export interface DeviceSpecsSummaryProps {
  assetType: string;
  specs?: SpecValues;
  extendedSpecs?: { key: string; value: string }[];
  notes?: string;
  description?: string;
}

interface SpecLabel {
  label: string;
  value: string;
}

function SpecsGrid({ labels }: { labels: SpecLabel[] }) {
  if (labels.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-quaternary">Specs</span>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {labels.map((l, i) => (
          <div key={`${l.label}-${i}`} className="flex flex-col">
            <dt className="text-xs text-quaternary">{l.label}</dt>
            <dd className="text-sm font-medium text-primary">{l.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function extendedAsLabels(
  rows?: { key: string; value: string }[],
): SpecLabel[] {
  if (!rows) return [];
  return rows
    .filter((r) => r.key || r.value)
    .map((r) => ({ label: r.key || "—", value: r.value || "—" }));
}

export function DeviceSpecsSummary({
  assetType,
  specs,
  extendedSpecs,
  notes,
  description,
}: DeviceSpecsSummaryProps) {
  const schemaId = getSchemaIdForAssetType(assetType);
  const structuredLabels = specs ? enumerateSpecLabels(schemaId, specs) : [];
  const extendedLabels = extendedAsLabels(extendedSpecs);
  const allLabels = [...structuredLabels, ...extendedLabels];
  const hasNotes = typeof notes === "string" && notes.trim() !== "";
  const hasLegacy =
    typeof description === "string" && description.trim() !== "";
  if (allLabels.length === 0 && !hasNotes && !hasLegacy) return null;

  return (
    <div className="flex flex-col gap-3">
      <SpecsGrid labels={allLabels} />
      {hasNotes && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-quaternary">Notes</span>
          <p className="text-sm leading-relaxed text-tertiary">{notes}</p>
        </div>
      )}
      {allLabels.length === 0 && !hasNotes && hasLegacy && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-quaternary">
            Description
          </span>
          <p className="text-sm leading-relaxed text-tertiary">{description}</p>
        </div>
      )}
    </div>
  );
}
