import type { ReactNode } from "react";

interface AssignmentGroupInviteProps {
  countryLabel: string;
  count: number;
  children: ReactNode;
}

const AssignmentGroupInvite: React.FC<AssignmentGroupInviteProps> = ({
  countryLabel,
  count,
  children,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-secondary bg-utility-brand-50 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-utility-brand-700">
          Most orders go to one place.
        </p>
        <p className="text-xs text-utility-brand-700 opacity-80">
          Send all {count} in {countryLabel} at once, then change any row that
          differs.
        </p>
      </div>
      <div className="w-[280px] max-w-full">{children}</div>
    </div>
  );
};

export default AssignmentGroupInvite;
