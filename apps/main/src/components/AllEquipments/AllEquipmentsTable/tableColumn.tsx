import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  EquipmentTableAssigneeCell,
  EquipmentTableDeviceStatusCell,
  EquipmentTableLocationCell,
  EquipmentTableNameCell,
  EquipmentTableRamCell,
  EquipmentTableSerialCell,
  EquipmentTableWarrantyCell,
} from "../EquipmentTableCells";
import { EquipmentTableOfficeCell } from "../EquipmentTableOfficeCell";

const AllEquipmentsTableColumn = (
  action: (item: Record<string, string>) => void,
  hideCheckBox?: boolean,
  onEquipmentNameClick?: (item: Record<string, string>) => void,
): readonly ColumnDef<Record<string, any>>[] => {
  const columns: ColumnDef<Record<string, any>>[] = [
    {
      header: "Equipment name",
      accessorKey: "title",
      cell: ({ row }) => (
        <EquipmentTableNameCell
          row={row.original}
          onEquipmentNameClick={onEquipmentNameClick}
        />
      ),
    },
    {
      header: "Assigned to",
      accessorKey: "assignee",
      cell: ({ row }) => <EquipmentTableAssigneeCell row={row.original} />,
    },
    {
      header: "Serial number",
      accessorKey: "serial_number",
      cell: ({ row }) => <EquipmentTableSerialCell row={row.original} />,
    },
    {
      header: "RAM/Storage",
      accessorKey: "spec",
      cell: ({ row }) => <EquipmentTableRamCell row={row.original} />,
    },
    {
      header: "Location",
      accessorKey: "country_code",
      cell: ({ row }) => <EquipmentTableLocationCell row={row.original} />,
    },
    {
      header: "Office",
      accessorKey: "office",
      cell: ({ row }) => <EquipmentTableOfficeCell row={row.original} />,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <EquipmentTableDeviceStatusCell row={row.original} />,
    },
    {
      header: "Warranty",
      accessorKey: "refresh_details",
      cell: ({ row }) => <EquipmentTableWarrantyCell row={row.original} />,
    },
    {
      id: "action",
      header: () => <span className="sr-only">Action</span>,
      cell: ({ row }) => action(row.original),
    },
  ];

  if (!hideCheckBox) {
    columns.splice(0, 0, {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          data-testid="allequipmentstablecolumn-checkbox"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          data-testid="allequipmentstablecolumn-checkbox-2"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  return columns;
};

export default AllEquipmentsTableColumn;
