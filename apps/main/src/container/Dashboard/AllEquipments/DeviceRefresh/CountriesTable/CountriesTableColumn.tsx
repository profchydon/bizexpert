import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import ReactCountryFlag from "react-country-flag";

const CountriesTableColumn = (
  action: (item: any) => void,
): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      header: "Country",
      accessorKey: "country_name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
            {row?.original?.country_code && (
              <ReactCountryFlag
                countryCode={row?.original?.country_code || ""}
                className=""
                svg
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            )}
            <span>{row?.original?.country_name || ""}</span>
          </div>
        );
      },
    },
    {
      header: "Average Device Age",
      accessorKey: "average_age",
      cell: ({ row }) => {
        return (
          <div className="text-sm flex items-center">
            {row?.original?.average_age || (
              <Badge variant="red" className="w-[96px]">
                Not available
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Overdue count",
      accessorKey: "overdue_count",
      cell: ({ row }) => {
        return (
          <div className="text-sm flex items-center">
            {row?.original?.overdue_count || 0}
          </div>
        );
      },
    },
    {
      id: "action",
      cell: ({ row }) => {
        return <>{action(row?.original)}</>;
      },
    },
  ];
  return columns;
};

export default CountriesTableColumn;
