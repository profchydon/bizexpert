"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTableListLocation } from "@/hooks/tableListLocation";
import { withListLocation } from "@/utils/tableListPage";
import routes from "@/routes";
import type { Kit, KitListItem } from "../types";
import { formatItemsCount, formatKitDate } from "../utils";
import FulfillmentBadge from "./FulfillmentBadge";
import KitActionsMenu from "./KitActionsMenu";
import KitCardView from "./KitCardView";
import KitStatusBadge from "./KitStatusBadge";

export type KitSortKey =
  | "name"
  | "items"
  | "fulfillment"
  | "status"
  | "updated";

export type KitSortOrder = "asc" | "desc";

interface Props {
  kits: (Kit | KitListItem)[];
  sortKey: KitSortKey;
  sortOrder: KitSortOrder;
  onSortChange: (key: KitSortKey, order: KitSortOrder) => void;
  onEdit: (kit: Kit | KitListItem) => void;
  onArchive: (kit: Kit | KitListItem) => void;
  onDuplicate: (kit: Kit | KitListItem) => void;
  onCreateKit?: () => void;
}

const KitTableView = (props: Props) => {
  const { sortKey, sortOrder, onSortChange } = props;
  const listLocation = useTableListLocation();
  const ascending = sortOrder === "asc";

  if (props.kits.length === 0) return <KitCardView {...props} />;

  const changeSort = (key: KitSortKey) => {
    if (key === sortKey) {
      onSortChange(key, ascending ? "desc" : "asc");
    } else {
      onSortChange(key, "asc");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(10,13,18,0.05)]">
      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <SortHead
                label="Kit Name"
                sortKey="name"
                activeKey={sortKey}
                ascending={ascending}
                onSort={changeSort}
              />
              <SortHead
                label="Items"
                sortKey="items"
                activeKey={sortKey}
                ascending={ascending}
                onSort={changeSort}
              />
              <SortHead
                label="Fulfillment Mode"
                sortKey="fulfillment"
                activeKey={sortKey}
                ascending={ascending}
                onSort={changeSort}
              />
              <SortHead
                label="Status"
                sortKey="status"
                activeKey={sortKey}
                ascending={ascending}
                onSort={changeSort}
              />
              <SortHead
                label="Last Updated"
                sortKey="updated"
                activeKey={sortKey}
                ascending={ascending}
                onSort={changeSort}
              />
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.kits.map((kit) => (
              <TableRow key={kit.id}>
                <TableCell>
                  <Link
                    href={withListLocation(
                      routes.KIT_DETAIL(kit.id),
                      listLocation,
                    )}
                    className="font-semibold text-primary-700 hover:underline"
                  >
                    {kit.name ?? "Untitled kit"}
                  </Link>
                </TableCell>
                <TableCell>{formatItemsCount(kit.items_count)}</TableCell>
                <TableCell>
                  <FulfillmentBadge mode={kit.fulfillment_mode} />
                </TableCell>
                <TableCell>
                  <KitStatusBadge status={kit.status} />
                </TableCell>
                <TableCell>{formatKitDate(kit.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <KitActionsMenu
                    kit={kit}
                    onEdit={props.onEdit}
                    onArchive={props.onArchive}
                    onDuplicate={props.onDuplicate}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const SortHead = ({
  label,
  sortKey,
  activeKey,
  ascending,
  onSort,
}: {
  label: string;
  sortKey: KitSortKey;
  activeKey: KitSortKey;
  ascending: boolean;
  onSort: (key: KitSortKey) => void;
}) => {
  const isActive = activeKey === sortKey;
  const Icon = isActive ? (ascending ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-600 transition hover:text-gray-900",
          isActive && "text-gray-900",
        )}
      >
        {label}
        <Icon className="size-3.5" />
      </button>
    </TableHead>
  );
};

export default KitTableView;
