import { toSpecificationRows } from "../../utils/spec";
import type { MarketplaceSpecEntry } from "../../types";

export interface TechnicalSpecificationsTableProps {
  spec?: MarketplaceSpecEntry[];
}

export const TechnicalSpecificationsTable = ({
  spec = [],
}: TechnicalSpecificationsTableProps) => {
  const rows = toSpecificationRows(spec);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="mp-overflow-hidden mp-rounded-xl mp-border mp-border-gray-200 mp-bg-white">
      <div className="mp-border-b mp-border-gray-200 mp-bg-gray-50 mp-px-4 mp-py-3">
        <h4 className="mp-text-sm mp-font-semibold mp-text-gray-900">
          Technical specifications
        </h4>
      </div>

      <div className="mp-divide-y mp-divide-gray-200">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`mp-grid mp-gap-1 mp-px-4 mp-py-3 mp-text-sm sm:mp-grid-cols-[160px_1fr] sm:mp-gap-4 ${
              index % 2 === 0 ? "mp-bg-white" : "mp-bg-surface-subtle"
            }`}
          >
            <span className="mp-font-medium mp-text-gray-600">{row.label}</span>
            <span className="mp-text-gray-900">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
