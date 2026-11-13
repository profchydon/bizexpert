import React, { FC, useMemo, useState } from "react";
import EmployeeTableColumn from "./tableColumns";
import EmployeeTableActions from "./tableActions";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EmployeeEmptyTableIntance from "./EmployeeEmptyTableIntance";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import EditEmployeeDrawer from "../AddEmployees/AddEmployee/EditEmployeeDrawer";
import { useRouter, useSearchParams } from "next/navigation";
import { IEmployees } from "@/types/employees";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import routes from "@/routes";
import { MdCancel } from "react-icons/md";
import { LuPlus } from "react-icons/lu";

interface ItemsCardProps {
  image: string;
  name: string;
  description: string;
  handleRemove: () => void;
}

const ItemsCard: FC<ItemsCardProps> = ({
  image,
  name,
  description,
  handleRemove,
}) => {
  return (
    <Card className="p-[0.231875rem] flex flex-row items-start justify-between gap-2">
      <div className="flex flex-row items-start gap-2">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={image || ""}
            alt="product_img"
            className="rounded-[8px]"
          />
          <AvatarFallback className="text-gray-600 bg-gray-100">{`${name?.[0]}`}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold text-left">{description}</p>
      </div>
      <MdCancel
        size={32}
        className="text-primary-700 h-auto cursor-pointer"
        onClick={handleRemove}
      />
    </Card>
  );
};

interface Props {
  handleImport: () => void;
  handleSelect: () => void;
  handleAddItems: () => void;
}

const EmployeeTable: FC<Props> = ({
  handleImport,
  handleSelect,
  handleAddItems,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const getDevices = searchParams.get("data_cart");
  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleRemoveEmployee = (employee_id: string) => {
    const removeById = (arr: any[], id: string) => {
      return arr.filter((item) => item.id !== id);
    };
    // @ts-ignore
    const updatedEmployee = removeById(employees, employee_id);
    dispatch(setSelectedEmployees(updatedEmployee));
  };

  const toggleEditEmployee = (employee_id: string) => {
    setIsOpen(true);
    router.replace(`/dashboard/equip-employee/employees?id=${employee_id}`);
  };

  const handleItemRemove = (getEmployee_id: string, item_id: string) => {
    const updateEmp = employees?.map((employee) => {
      if (employee.id === getEmployee_id) {
        return {
          ...employee,
          items: employee?.items?.filter(
            (item) => item_id !== item?.specification?.id,
          ),
        };
      }
      return employee;
    });

    if (updateEmp) {
      dispatch(setSelectedEmployees(updateEmp));
    }
  };

  const columns: any = useMemo(
    () =>
      EmployeeTableColumn((item: Record<string, string>) => (
        <EmployeeTableActions
          onEdit={() => toggleEditEmployee(item?.id)}
          onRemove={() => toggleRemoveEmployee(item?.id)}
        />
      )),
    [employees],
  );

  const renderExpandedRowContent = (row: IEmployees) => (
    <div className="w-full flex flex-row gap-4">
      <div className="flex-1 grid grid-cols-3 gap-3">
        {row?.items?.map((item) => (
          <>
            <ItemsCard
              handleRemove={() =>
                handleItemRemove(row?.id, item?.specification?.id as string)
              }
              image={item?.images?.[0] || ""}
              name={item?.asset?.name}
              description={`
                  ${item?.asset?.name || ""}${" "}
                  ${item?.specification?.properties?.map((item) => item?.value).join(" ") || ""}
              `}
            />
          </>
        ))}
      </div>
      <Button
        variant="primary"
        onClick={() => {
          if (getDevices) {
            return (
              router.push(
                `${routes.EQUIP_EMPLOYEE_EMPLOYEES}?employee_id=${row?.id}&data=${getDevices}`,
              ),
              handleAddItems()
            );
          } else {
            return (
              router.push(
                `${routes.EQUIP_EMPLOYEE_EMPLOYEES}?employee_id=${row?.id}`,
              ),
              handleAddItems()
            );
          }
        }}
        data-testid="employeetable-button"
      >
        <LuPlus /> Add item
      </Button>
    </div>
  );

  return (
    <>
      <Card className="mt-8">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
          <h3 className="text-lg flex flex-row items-center gap-3 font-semibold text-gray-900">
            Employees{" "}
            {employees?.length && (
              <Badge variant="mild" className="empty:hidden">
                {employees?.length} Employees
              </Badge>
            )}
          </h3>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          {/* @ts-ignore */}
          <DataTable
            data={employees || []}
            columns={columns}
            // renderExpandedRowContent={renderExpandedRowContent}
          >
            <EmployeeEmptyTableIntance
              handleImport={handleImport}
              handleSelect={handleSelect}
            />
          </DataTable>
        </CardContent>
      </Card>

      <EditEmployeeDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default EmployeeTable;
