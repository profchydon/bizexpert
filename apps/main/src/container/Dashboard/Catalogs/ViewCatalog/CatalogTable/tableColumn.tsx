import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { roundedImage_placeholder } from "@/assets/images";
import { IAsset } from "@/types/assets";
import formatAmount from "@/utils/formatAmount";
import { Badge } from "@/components/ui/badge";

const CatalogTableColumn = (
  action: (item: IAsset) => void,
): readonly ColumnDef<IAsset>[] => [
  {
    header: "Product Name",
    accessorKey: "product_name",
    cell: ({ row }) => {
      return (
        <div className="flex sm:gap-x-1 items-center">
          <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
            <Image
              src={row.original.images?.[0] ?? roundedImage_placeholder}
              alt={row?.original?.name}
              className="w-full object-fill rounded-full"
              width={40}
              height={40}
            />
          </div>
          <p>
            {" "}
            {row.original.name ?? (
              <Badge variant="red">Not available</Badge>
            )}{" "}
          </p>
        </div>
      );
    },
  },
  {
    header: "Product Type",
    accessorKey: "product_type",
    cell: ({ row }) => {
      return (
        <p>
          {row.original.category ?? <Badge variant="red">Not available</Badge>}
        </p>
      );
    },
  },
  {
    header: "Product State",
    accessorKey: "product_state",
    cell: ({ row }) => {
      const condition = Object.entries(row.original.spec)
        .map(([key, value]) => ({
          label: key,
          value: value,
        }))
        .find((data) => data.label === "condition")?.value as unknown as string;
      return <p>{condition! ?? <Badge variant="red">Not available</Badge>}</p>;
    },
  },

  {
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => {
      return (
        <p>
          {row.original.asset_pricing.currency.symbol}
          {formatAmount(row.original.asset_pricing.amount)}
        </p>
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

export default CatalogTableColumn;
