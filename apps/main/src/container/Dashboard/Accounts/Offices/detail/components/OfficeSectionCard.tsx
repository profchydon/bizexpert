import type { ReactNode } from "react";

interface Props {
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
  bulkBar?: ReactNode;
  children: ReactNode;
}

export function OfficeSectionCard({
  title,
  badge,
  action,
  bulkBar,
  children,
}: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {badge}
        </div>
        {action}
      </div>
      {bulkBar}
      {children}
    </section>
  );
}
