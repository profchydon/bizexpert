import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { ColumnDef } from "@tanstack/react-table";
import ReactCountryFlag from "react-country-flag";
import EmployeeDevicesCell from "./EmployeeDevicesCell";
import type { IEmployees } from "@/types/employees";
import { HeaderSelectCheckbox, RowSelectCheckbox } from "./selectionCheckboxes";
import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";

type DepartmentResolver = (id?: string) => string | null | undefined;

const AllEmployeeTableColumn = (
  action: (item: Record<string, string>) => void,
  departmentById: DepartmentResolver,
): readonly ColumnDef<Record<string, any>>[] => [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: () => <HeaderSelectCheckbox />,
    cell: ({ row }) => (
      <RowSelectCheckbox employee={row?.original as IEmployees} />
    ),
  },
  {
    header: "Name",
    accessorKey: "first_name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm font-medium text-gray-600 bg-gray-100">{`${row?.original?.first_name?.[0] ?? ""}${row?.original?.last_name?.[0] ?? ""}`}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-gray-900 font-medium text-sm">{`${row?.original?.first_name} ${row?.original?.last_name}`}</p>
            {row.original?.employment_type ? (
              <p className="text-gray-600 text-xs">
                {row?.original?.employment_type ? (
                  removeUserscore(row?.original?.employment_type)
                ) : (
                  <Badge variant="red">Not available</Badge>
                )}
              </p>
            ) : (
              "---------------"
            )}
          </div>
        </div>
      );
    },
  },
  {
    header: "Department",
    accessorKey: "department",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <p className="text-gray-900 font-medium text-sm">
            {removeUserscore(row?.original?.level ?? "---------------")}
          </p>
          <p className="text-gray-600 text-xs">
            {departmentById(row?.original?.departments?.[0]?.id)}
          </p>
        </div>
      );
    },
  },
  {
    header: "Email address",
    accessorKey: "email",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <p className="text-gray-900 font-medium text-sm">
            {row?.original?.email}
          </p>
          <p className="text-gray-600 text-xs">{row?.original?.phone}</p>
        </div>
      );
    },
  },
  {
    header: "Devices",
    accessorKey: "equipment",
    enableSorting: false,
    cell: ({ row }) => {
      return <EmployeeDevicesCell row={row?.original} />;
    },
  },
  {
    header: "Country",
    accessorKey: "country",
    cell: ({ row }) => {
      const countryName = resolveCountryText(row?.original?.country) ?? "";
      const countryCode = resolveCountryCode(
        row?.original?.country_code,
        row?.original?.country,
      );
      return (
        <div className="flex items-center gap-x-2">
          {countryCode ? (
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              className="rounded-full"
              style={{
                width: "20px",
                height: "20px",
              }}
            />
          ) : null}
          <span className="text-gray-600 text-sm">{countryName}</span>
        </div>
      );
    },
  },
  {
    id: "action",
    enableSorting: false,
    cell: ({ row }) => {
      return action(row?.original);
    },
  },
];

export default AllEmployeeTableColumn;
