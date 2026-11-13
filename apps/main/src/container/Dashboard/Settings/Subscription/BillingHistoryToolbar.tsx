"use client";

import { SearchLg } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

const STATUSES = [
  { id: "all", label: "All statuses" },
  { id: "open", label: "Open" },
  { id: "paid", label: "Paid" },
  { id: "void", label: "Void" },
];

export function BillingHistoryToolbar({
  search,
  status,
  onSearch,
  onStatus,
}: {
  search: string;
  status: string;
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
}) {
  return (
    <div className="flex w-full items-center gap-3 md:w-auto">
      <div className="w-full md:w-72">
        <Input
          icon={SearchLg}
          size="sm"
          placeholder="Search invoices"
          aria-label="Search invoices"
          value={search}
          onChange={onSearch}
          data-testid="billinghistorytoolbar-input"
        />
      </div>
      <div className="w-40 shrink-0">
        <Select
          size="sm"
          aria-label="Invoice status"
          selectedKey={status || "all"}
          items={STATUSES}
          onSelectionChange={(key) =>
            onStatus(!key || key === "all" ? "" : String(key))
          }
          data-testid="billinghistorytoolbar-select"
        >
          {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
      </div>
    </div>
  );
}
