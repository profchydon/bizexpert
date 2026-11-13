"use client";

import { useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import type { SortDescriptor } from "react-aria-components";
import { TablePaginationFooter } from "@/components/application/pagination/table-pagination-footer";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Input } from "@/components/base/input/input";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { USAGE_LABEL, USAGE_TOOLTIP } from "../softwareInventory";
import { PWA_TOOLTIP } from "../telemetryTooltips";
import type { AppUsage, SoftwareItem } from "../types";
import { CardDisclosureHeader } from "../DetailCard";
import { filterApps, sortApps } from "./appInventorySort";

const DEFAULT_PAGE_SIZE = 10;
// A dormant application is a licence worth reclaiming, not a fault. Red here competes with
// the failing checks and the escalation state, which are the things that are actually wrong.
const USAGE_COLOR: Record<AppUsage, "success" | "gray" | "blue"> = {
  active: "success",
  occasional: "gray",
  unused: "blue",
};

const columns = [
  {
    id: "name",
    label: "Name",
    tooltip: "The application as the operating system reports it.",
    sortable: true,
  },
  {
    id: "version",
    label: "Version",
    tooltip: "The version installed at the last sync.",
    sortable: true,
  },
  {
    id: "installed",
    label: "Installed",
    tooltip: "When the agent first saw this application.",
    sortable: true,
  },
  {
    id: "lastRun",
    label: "Last run",
    tooltip: "When the application was last launched.",
    sortable: true,
  },
  {
    id: "usage",
    label: "Usage",
    tooltip: "How recently the application has actually been run.",
    sortable: true,
  },
];

// The flat two column list becomes a real inventory. The usage column is the point of it:
// installed and still licensed is not the same as in use.
export function AppInventoryCard({ software }: { software: SoftwareItem[] }) {
  const [sort, setSort] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const { page, setPage } = useTablePageQuery("apps_page");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [query, setQuery] = useState("");
  // Reference, not diagnosis, so it does not cost a screen on every visit.
  const [open, setOpen] = useState(false);

  const rows = sortApps(filterApps(software, query), sort);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows
    .slice((page - 1) * pageSize, page * pageSize)
    .map((app) => ({ ...app, id: app.name }));
  const unused = software.filter((app) => app.usage === "unused").length;

  return (
    <TableCard.Root>
      {/* TableCard has no disclosure of its own, and nesting it in a DetailCard would draw
          the card chrome twice, so it borrows DetailCard's header directly. */}
      <CardDisclosureHeader
        title="Installed applications"
        open={open}
        onToggle={() => setOpen((v) => !v)}
        action={
          <span className="text-sm text-tertiary">
            {software.length} total{unused > 0 ? `, ${unused} dormant` : ""}
          </span>
        }
      />
      {open && (
        <>
          <div className="flex flex-col gap-3 border-b border-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-tertiary">
              {unused > 0
                ? `${unused} applications have not run in 60 days. Each one is a licence you may be able to reclaim.`
                : "Every application has run recently."}
            </div>
            <div className="sm:w-64">
              <Input
                size="sm"
                aria-label="Search installed applications"
                placeholder="Search applications"
                value={query}
                onChange={(value) => {
                  setQuery(value);
                  setPage(1);
                }}
                data-testid="appinventorycard-input"
              />
            </div>
          </div>
          <Table
            aria-label="Installed applications"
            className="min-w-[720px]"
            sortDescriptor={sort}
            onSortChange={(s) => {
              setSort(s);
              setPage(1);
            }}
          >
            <Table.Header columns={columns}>
              {(column) => (
                <Table.Head
                  id={column.id}
                  label={column.label}
                  tooltip={column.tooltip}
                  allowsSorting={column.sortable}
                  isRowHeader={column.id === "name"}
                />
              )}
            </Table.Header>
            <Table.Body items={pageRows}>
              {(row) => {
                const app = row as SoftwareItem & { id: string };
                return (
                  <Table.Row id={app.id}>
                    <Table.Cell>
                      <span className="flex items-center gap-2 font-medium text-primary">
                        {app.name}
                        {app.isPwa && (
                          <Tooltip title={PWA_TOOLTIP} placement="top">
                            <TooltipTrigger className="cursor-default">
                              <Badge color="blue-light" size="sm">
                                Web app
                              </Badge>
                            </TooltipTrigger>
                          </Tooltip>
                        )}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-tertiary tabular-nums">
                      {app.version}
                    </Table.Cell>
                    <Table.Cell className="text-quaternary tabular-nums">
                      {app.installedLabel}
                    </Table.Cell>
                    <Table.Cell className="text-secondary tabular-nums">
                      {app.lastRunLabel}
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip title={USAGE_TOOLTIP[app.usage]} placement="top">
                        <TooltipTrigger className="cursor-default">
                          <Badge color={USAGE_COLOR[app.usage]} size="sm">
                            {USAGE_LABEL[app.usage]}
                          </Badge>
                        </TooltipTrigger>
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            </Table.Body>
          </Table>
          {rows.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-tertiary">
              No applications match your search.
            </div>
          )}
          {rows.length > DEFAULT_PAGE_SIZE && (
            <TablePaginationFooter
              currentPage={page}
              itemsPerPage={pageSize}
              totalItems={rows.length}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )}
        </>
      )}
    </TableCard.Root>
  );
}
