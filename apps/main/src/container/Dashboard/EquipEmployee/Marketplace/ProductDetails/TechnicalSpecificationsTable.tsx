import { ISpec } from "@/types/assets";
import { toSpecificationRows } from "./spec-utils";

interface Props {
  specs: ISpec[];
}

const TechnicalSpecificationsTable: React.FC<Props> = ({ specs }) => {
  const rows = toSpecificationRows(specs);
  if (rows.length === 0) return null;

  return (
    <div className="flex flex-col">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[120px_1fr] gap-3 py-2 text-sm"
        >
          <span className="font-medium text-gray-600">{row.label}</span>
          <span className="text-gray-900">{row.value}</span>
        </div>
      ))}
    </div>
  );
};

export default TechnicalSpecificationsTable;
