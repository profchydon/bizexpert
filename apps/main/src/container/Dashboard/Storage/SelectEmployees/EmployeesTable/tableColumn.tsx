import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import useDepartment from "@/hooks/useDepartment";
import { IEmployees } from "@/types/employees";
import { removeUserscore } from "@/utils/underScoreTransformer";
import {
  resolveCountryCode,
  resolveCountryText,
} from "@/utils/resolveCountryText";
import { ColumnDef } from "@tanstack/react-table";
import ReactCountryFlag from "react-country-flag";

const AllEmployeeTableColumn = (
  action: (item: IEmployees) => void,
): readonly ColumnDef<IEmployees>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="ml-1"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        data-testid="employeestablecolumn-checkbox"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        data-testid="employeestablecolumn-checkbox-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "first_name",
    cell: ({ row }) => {
      return (
        <div className="flex fle-row items-start gap-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-gray-600 bg-gray-100">{`${row?.original?.first_name?.[0]} ${row?.original?.last_name?.[0]}`}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-gray-900 font-medium text-sm">{`${row?.original?.first_name} ${row?.original?.last_name}`}</p>
            {row.original?.employment_type && (
              <p className="text-gray-600 text-sm">
                {row?.original?.employment_type ? (
                  removeUserscore(row?.original?.employment_type)
                ) : (
                  <Badge variant="red">Not available</Badge>
                )}
              </p>
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
          <p className="text-gray-900 text-sm">
            {removeUserscore(row?.original?.level || "")}
          </p>
          <p className="text-gray-600 text-sm">
            {useDepartment()?.departmentById(
              row?.original?.departments?.[0]?.id || "",
            )}
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
          <p className="text-gray-900 text-sm">{row?.original?.email}</p>
          <p className="text-gray-600 text-sm">{row?.original?.phone}</p>
        </div>
      );
    },
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <p className="text-gray-600 text-sm">{row?.getValue("address")}</p>
        </div>
      );
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
              className=""
              svg
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
    cell: ({ row }) => {
      return action(row?.original);
    },
  },
];

export default AllEmployeeTableColumn;
