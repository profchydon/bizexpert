import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { IEquipmentDocument } from "@/types/equipments";
import dayjs from "dayjs";
import { getFileIcon } from "@/utils/getFileIcon";
import { Badge } from "@/components/ui/badge";

const AssetDocumentsTabColumn = (
  action: (item: IEquipmentDocument) => void,
  viewInvoice: (item: any) => void,
): readonly ColumnDef<IEquipmentDocument>[] => {
  const columns: ColumnDef<IEquipmentDocument>[] = [
    {
      header: "Invoice",
      accessorKey: "invoice",
      enableSorting: false,
      cell: ({ row }) => {
        const fileUrl = row?.original?.url;
        const icon = getFileIcon(fileUrl);
        return (
          <div className="flex items-center gap-x-3">
            <Image src={icon} alt="alt-invoice" />
            <p
              onClick={() => viewInvoice(row?.original)}
              className="text-primary-700 cursor-pointer hover:underline text-sm font-medium"
            >
              {row?.original?.name || (
                <Badge variant="red">Not available</Badge>
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: () => <div className="text-right w-full block">Date Added</div>,
      accessorKey: "date",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-gray-600 text-sm font-normal text-right min-w-[180px]">
            {!row?.original?.date_added ? (
              <Badge variant="red">Not available</Badge>
            ) : (
              dayjs(row?.original.date_added).format("MMM DD, YYYY")
            )}
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

  return columns;
};

export default AssetDocumentsTabColumn;
