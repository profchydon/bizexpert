import React, { FC, useMemo } from "react";

import DevicesTableColumn from "./tableColumns";
import DevicesTableActions from "./tableActions";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";

interface Props {
  toggleAddItems: () => void;
  toggleRemoveEmployee: () => void;
  toggleAddSetup: () => void;
  toggleAddFulfilmentDateToAll: () => void;
}

const DevicesTable: FC<Props> = ({
  toggleAddItems,
  toggleRemoveEmployee,
  toggleAddSetup,
  toggleAddFulfilmentDateToAll,
}) => {
  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );

  const totalItems = employees?.reduce((sum, employee) => {
    return sum + (employee.items?.length || 0);
  }, 0);

  const columns: any = useMemo(
    () =>
      DevicesTableColumn((item: Record<string, string>) => (
        <DevicesTableActions
          item={item}
          onAdd={toggleAddItems}
          onRemove={toggleRemoveEmployee}
          onAddSetup={toggleAddSetup}
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
          <div className="flex">
            <Button
              className="font-semibold text-sm"
              onClick={toggleAddFulfilmentDateToAll}
              data-testid="devicestable-button"
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

export default DevicesTable;
