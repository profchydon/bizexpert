"use client";

type Row = Record<string, any>;

export const EquipmentTableOfficeCell = ({ row }: { row: Row }) => {
  const officeName = row?.office?.name;

  if (!officeName) {
    return <span className="text-sm text-quaternary">—</span>;
  }

  const areaName = row?.office_area?.name;

  return (
    <div className="flex min-w-0 flex-col items-start">
      <span className="truncate text-sm text-primary" title={officeName}>
        {officeName}
      </span>
      {areaName ? (
        <span className="truncate text-sm text-tertiary" title={areaName}>
          {areaName}
        </span>
      ) : null}
    </div>
  );
};
