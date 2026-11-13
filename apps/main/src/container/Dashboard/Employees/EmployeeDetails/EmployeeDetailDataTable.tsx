"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { employeeDetailDataTableProps } from "./employeeDetailTableClasses";

type Props<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
};

const EmployeeDetailDataTable = <TData,>({ data, columns }: Props<TData>) => {
  return (
    <div className="overflow-x-auto">
      <DataTable
        data={data}
        columns={columns}
        {...employeeDetailDataTableProps}
      />
    </div>
  );
};

export default EmployeeDetailDataTable;
