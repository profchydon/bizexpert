import { cn } from "@/lib/utils";
import {
  ASSIGN_COLUMNS,
  ASSIGN_ROW_COLS,
  ASSIGN_ROW_GRID,
  ASSIGN_ROW_PX,
} from "./assignRowLayout";

const AssignmentColumnHeader: React.FC = () => {
  return (
    <div
      className={cn(
        ASSIGN_ROW_GRID,
        ASSIGN_ROW_PX,
        "border-b border-secondary py-2.5",
      )}
      style={{ gridTemplateColumns: ASSIGN_ROW_COLS }}
    >
      {ASSIGN_COLUMNS.map((label, index) => (
        <span
          key={label || `col-${index}`}
          className={cn(
            "whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.09em] text-quaternary",
            label === "Price" && "text-right",
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
};

export default AssignmentColumnHeader;
