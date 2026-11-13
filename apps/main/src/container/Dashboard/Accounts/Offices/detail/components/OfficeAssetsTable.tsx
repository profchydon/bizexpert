"use client";

import Link from "next/link";
import Pagination from "@/components/Custom/Pagination";
import routes from "@/routes";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OfficeAsset } from "../../types/officeAsset";
import { formatOfficeMoney } from "../utils/officeFormat";
import type { MemberSort } from "../utils/sortOfficeMembers";
import { toggleRowSelection } from "../utils/toggleRowSelection";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeviceIcon } from "./DeviceIcon";
import { OfficeMemberTableHead } from "./OfficeMemberTableHead";

const columns = [
  {
    id: "name" as const,
    label: "Device",
    tooltip: "The device model and type.",
  },
  {
    id: "serial" as const,
    label: "Serial",
    tooltip: "The device serial number.",
    sortable: false,
  },
  {
    id: "assignedTo" as const,
    label: "Assigned to",
    tooltip: "The employee or office location the device is assigned to.",
  },
  {
    id: "value" as const,
    label: "Value",
    tooltip: "The device's value in the office currency.",
  },
];

interface Props {
  active: boolean;
  pageRows: OfficeAsset[];
  sort: MemberSort;
  page: number;
  totalPages: number;
  showPagination: boolean;
  selected: Set<string>;
  onSortChange: (column: Exclude<MemberSort["column"], "">) => void;
  onPageChange: (page: number) => void;
  onApplySelection: (pageIds: string[], keys: "all" | Set<string>) => void;
  onAssign: (asset: OfficeAsset) => void;
}

export function OfficeAssetsTable({
  active,
  pageRows,
  sort,
  page,
  totalPages,
  showPagination,
  selected,
  onSortChange,
  onPageChange,
  onApplySelection,
  onAssign,
}: Props) {
  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              {active && (
                <TableHead className="w-12 px-6 py-3">
                  <Checkbox
                    checked={
                      pageRows.length > 0 &&
                      pageRows.every((row) => selected.has(row.id))
                    }
                    onCheckedChange={(checked) =>
                      onApplySelection(
                        pageRows.map((row) => row.id),
                        checked ? "all" : new Set(),
                      )
                    }
                    aria-label="Select all assets on this page"
                    data-testid="officeassetstable-checkbox"
                  />
                </TableHead>
              )}
              <OfficeMemberTableHead
                columns={columns}
                sort={sort}
                onSortChange={onSortChange}
              />
              {active && <TableHead className="w-20 px-6 py-3" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((asset) => (
              <TableRow
                key={asset.id}
                className={active ? "cursor-pointer" : undefined}
                onClick={() =>
                  active &&
                  onApplySelection(
                    pageRows.map((row) => row.id),
                    toggleRowSelection(selected, asset.id),
                  )
                }
              >
                {active && (
                  <TableCell className="px-6 py-4">
                    <Checkbox
                      checked={selected.has(asset.id)}
                      onClick={(event) => event.stopPropagation()}
                      onCheckedChange={() =>
                        onApplySelection(
                          pageRows.map((row) => row.id),
                          toggleRowSelection(selected, asset.id),
                        )
                      }
                      aria-label={`Select ${asset.name}`}
                      data-testid="officeassetstable-checkbox-2"
                    />
                  </TableCell>
                )}
                <TableCell className="px-6 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <DeviceIcon type={asset.deviceType} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {asset.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {asset.deviceType}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">
                  {asset.serial}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">
                  <div className="min-w-0">
                    {asset.awaitingPlacement ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">
                              <Badge color="warning" size="sm">
                                Awaiting placement
                              </Badge>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Bought for this office and not placed yet. Assign it
                            to a room or a person.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : asset.assigneeId && asset.assigneeName ? (
                      <Link
                        href={`${routes.EMPLOYEES}/${asset.assigneeId}`}
                        onClick={(event) => event.stopPropagation()}
                        className="truncate font-medium text-primary-700 hover:underline"
                      >
                        {asset.assigneeName}
                      </Link>
                    ) : (
                      <p className="truncate">{asset.assignedTo}</p>
                    )}
                    {asset.assigneeName && asset.officeAreaName && (
                      <p className="truncate text-xs text-gray-500">
                        {asset.officeAreaName}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-gray-900">
                  {formatOfficeMoney(asset.value, asset.currency)}
                </TableCell>
                {active && (
                  <TableCell className="px-6 py-4 text-right">
                    {asset.awaitingPlacement && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        onClick={(event) => {
                          event.stopPropagation();
                          onAssign(asset);
                        }}
                        data-testid="officeassetstable-button"
                      >
                        Assign
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="border-t border-gray-200 px-5 py-4">
          <Pagination
            currentPage={page}
            lastPage={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
