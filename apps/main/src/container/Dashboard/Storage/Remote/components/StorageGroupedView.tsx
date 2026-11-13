"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "@untitledui/icons";
import type { Selection } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { RequestKind, StoredDevice } from "../types/storage";
import { groupByCountry } from "../utils/filterDevices";
import { CountryFlag } from "./CountryFlag";
import { StorageInventoryTable } from "./StorageInventoryTable";

interface Props {
  rows: StoredDevice[];
  onOpen: (d: StoredDevice) => void;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
  selectedKeys?: Selection;
  onScopeSelectionChange?: (scopeIds: string[], keys: Selection) => void;
}

export function StorageGroupedView({
  rows,
  onOpen,
  onAction,
  selectedKeys,
  onScopeSelectionChange,
}: Props) {
  const groups = groupByCountry(rows);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (country: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(country) ? next.delete(country) : next.add(country);
      return next;
    });

  return (
    <div className="flex flex-col">
      {groups.map((group) => {
        const isOpen = !collapsed.has(group.country);
        return (
          <div
            key={group.country}
            className="border-t border-secondary first:border-t-0"
          >
            <div className="flex w-full items-center gap-2 px-5 py-3">
              <button
                type="button"
                onClick={() => toggle(group.country)}
                className="flex items-center gap-2 text-left hover:opacity-80"
              >
                {isOpen ? (
                  <ChevronDown className="size-4 text-quaternary" />
                ) : (
                  <ChevronRight className="size-4 text-quaternary" />
                )}
                <CountryFlag
                  country={group.country}
                  countryCode={group.devices[0]?.countryCode}
                />
                <span className="text-sm font-semibold text-primary">
                  {group.country}
                </span>
              </button>
              <Tooltip
                title={`${group.devices.length} devices stored in ${group.country}`}
                placement="top"
              >
                <TooltipTrigger className="cursor-default">
                  <Badge size="sm" type="pill-color" color="gray">
                    {group.devices.length}
                  </Badge>
                </TooltipTrigger>
              </Tooltip>
            </div>
            {isOpen && (
              <StorageInventoryTable
                rows={group.devices}
                onOpen={onOpen}
                onAction={onAction}
                renderEmptyState={() => null}
                selectedKeys={selectedKeys}
                onSelectionChange={
                  onScopeSelectionChange
                    ? (keys) =>
                        onScopeSelectionChange(
                          group.devices.map((d) => d.id),
                          keys,
                        )
                    : undefined
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
