"use client";

import { useState } from "react";
import type { SortDescriptor } from "react-aria-components";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { memorySummary } from "../memoryUsage";
import type { AgentTelemetry, MemoryConsumer } from "../types";
import { CardDisclosureHeader } from "../DetailCard";
import { sortConsumers } from "./memoryConsumersSort";

const columns = [
  {
    id: "name",
    label: "Application",
    tooltip: "The process as the operating system reports it.",
    sortable: true,
  },
  {
    id: "state",
    label: "State",
    tooltip: "Whether it was running at the last check-in.",
    sortable: true,
  },
  {
    id: "share",
    label: "Share of installed memory",
    tooltip: "Average memory held, measured against the memory installed.",
    sortable: true,
  },
  {
    id: "avg",
    label: "Average",
    tooltip: "Average memory held while running, over the last 7 days.",
    sortable: true,
  },
];

// Six rows of ranked numeric data is a data table, so it is built as one: sortable columns
// and a help icon on every header, like the applications table below it. It was a hand
// rolled grid with neither, which made two tables on one tab read as two products.
//
// The bar measures share of installed memory, the same denominator the header names and the
// same one the percentage uses. It previously scaled to the heaviest consumer, so the top
// application always filled the track: a full width bar labelled 32% under a header that
// said "Share of 16 GB". The empty half of the machine is the reader's to see.
export function MemoryConsumersCard({
  telemetry,
}: {
  telemetry: AgentTelemetry;
}) {
  const { memory } = telemetry;
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<SortDescriptor>({
    column: "",
    direction: "descending",
  });

  const rows = sortConsumers(memory.consumers, sort).map((c) => ({
    ...c,
    id: c.name,
  }));

  return (
    <TableCard.Root>
      <CardDisclosureHeader
        title="Top memory consumers"
        open={open}
        onToggle={() => setOpen((v) => !v)}
        action={
          <span className="text-sm text-tertiary">
            Average footprint while running, last 7 days
          </span>
        }
      />
      {open && (
        <>
          <Table
            aria-label="Top memory consumers"
            className="min-w-[640px]"
            sortDescriptor={sort}
            onSortChange={setSort}
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
            <Table.Body items={rows}>
              {(row) => {
                const app = row as MemoryConsumer & { id: string };
                const pct = Math.round((app.avgGb / memory.totalGb) * 100);
                return (
                  <Table.Row id={app.id}>
                    <Table.Cell className="font-medium text-primary">
                      {app.name}
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        title={
                          app.runningNow
                            ? "Running at the last check-in. This moves between syncs."
                            : "Not running at the last check-in."
                        }
                        placement="top"
                      >
                        <TooltipTrigger className="cursor-default">
                          <Badge
                            color={app.runningNow ? "success" : "gray"}
                            size="sm"
                          >
                            {app.runningNow ? "Running" : "Idle"}
                          </Badge>
                        </TooltipTrigger>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="flex items-center gap-3">
                        <span className="relative h-2 w-full min-w-24 rounded-full bg-secondary">
                          <span
                            className="block h-full rounded-full bg-brand-solid"
                            style={{ width: `${pct}%` }}
                          />
                          {/* Halfway mark. With bars this short, a reference line is what makes
                              "is anything eating this machine" answerable without arithmetic. */}
                          <span className="absolute -top-0.5 -bottom-0.5 left-1/2 w-px bg-border-secondary" />
                        </span>
                        <span className="shrink-0 text-xs text-quaternary tabular-nums">
                          {pct}%
                        </span>
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-secondary tabular-nums">
                      {app.avgGb.toFixed(1)} GB
                    </Table.Cell>
                  </Table.Row>
                );
              }}
            </Table.Body>
          </Table>
          <p className="border-t border-secondary px-6 py-4 text-sm text-tertiary">
            {memorySummary(memory)} Bars and percentages are both measured
            against the {memory.totalGb} GB installed, so the empty space is
            real headroom.
          </p>
        </>
      )}
    </TableCard.Root>
  );
}
