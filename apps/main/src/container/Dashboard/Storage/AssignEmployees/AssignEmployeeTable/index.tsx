import React, { FC, useMemo } from "react";

import AssignToEmployeeTableColumn from "./tableColumns";
import AssignEmployeeTableActions from "./tableActions";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface Props {
  toggleAddItems: () => void;
  toggleRemoveEmployee: () => void;
  toggleAddSetup: () => void;
  toggleAllFulfilmentStartDate: () => void;
  itemCount?: number;
}

const AssignEmployeeTable: FC<Props> = ({
  toggleAddItems,
  toggleRemoveEmployee,
  toggleAddSetup,
  toggleAllFulfilmentStartDate,
  itemCount,
}) => {
  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );

  const totalItems = employees?.length ?? 0;

  const columns: any = useMemo(
    () =>
      AssignToEmployeeTableColumn((item: Record<string, string>) => (
        <AssignEmployeeTableActions
          item={item}
          onAdd={toggleAddItems}
          onAddSetup={toggleAddSetup}
          onRemove={toggleRemoveEmployee}
        />
      )),
    [employees],
  );
  return (
    <>
      <Card className="mt-8">
        <CardHeader className="p-4 border-b border-border-secondary flex flex-row items-center justify-between">
          <h3 className="text-lg flex flex-row items-center gap-3 font-semibold text-gray-900">
            Employees{" "}
            {totalItems && (
              <Badge
                className="empty:hidden bg-primary-25 text-primary-700"
                variant="blue"
              >
                {totalItems} Items Available
              </Badge>
            )}
          </h3>

          <div className="flex gap-x-3 items-center">
            {itemCount! > 0 && (
              <Badge
                variant={"red"}
                className="h-8 text-sm flex gap-x-2 items-center"
              >
                <ShoppingBag size={15} />{" "}
                <span>
                  <span className="text-error-800 font-semibold">
                    {itemCount ?? 0}
                  </span>{" "}
                  item(s) remaining
                </span>
              </Badge>
            )}
            {itemCount! === 0 && (
              <Badge
                variant={"success"}
                className="h-8 text-sm flex gap-x-2 items-center"
              >
                <ShoppingBag size={15} />{" "}
                <span>
                  <span className="text-success-800 font-semibold">
                    {itemCount ?? 0}
                  </span>{" "}
                  Item remaining
                </span>
              </Badge>
            )}
            <Button
              className="text-sm"
              onClick={toggleAllFulfilmentStartDate}
              data-testid="assignemployeetable-button"
            >
              Add fulfillment start date
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          <DataTable data={employees || []} columns={columns}></DataTable>
        </CardContent>
      </Card>
    </>
  );
};

export default AssignEmployeeTable;
