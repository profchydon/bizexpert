"use client";

import { Grid01, Rows01, SearchLg } from "@untitledui/icons";
import {
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/base/button-group/button-group";
import { Input } from "@/components/base/input/input";
import {
  transactionFilterTabs,
  type TransactionFilter,
  type TransactionView,
} from "../transactionMethodMeta";

interface Props {
  search: string;
  filter: TransactionFilter;
  view: TransactionView;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: TransactionFilter) => void;
  onViewChange: (value: TransactionView) => void;
}

const TransactionToolbar = ({
  search,
  filter,
  view,
  onSearchChange,
  onFilterChange,
  onViewChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between gap-3 lg:justify-start">
        <ButtonGroup
          size="md"
          selectedKeys={new Set([filter])}
          onSelectionChange={(keys) => {
            const next = Array.from(keys)[0] as TransactionFilter | undefined;
            if (next) onFilterChange(next);
          }}
        >
          {transactionFilterTabs.map((tab) => (
            <ButtonGroupItem key={tab.key} id={tab.key}>
              {tab.label}
            </ButtonGroupItem>
          ))}
        </ButtonGroup>

        <ButtonGroup
          size="md"
          selectedKeys={new Set([view])}
          onSelectionChange={(keys) => {
            const next = Array.from(keys)[0] as TransactionView | undefined;
            if (next) onViewChange(next);
          }}
          className="shrink-0 lg:hidden"
          aria-label="View mode"
        >
          <ButtonGroupItem
            id="card"
            iconLeading={Grid01}
            aria-label="Card view"
          />
          <ButtonGroupItem
            id="table"
            iconLeading={Rows01}
            aria-label="Table view"
          />
        </ButtonGroup>
      </div>

      <div className="flex items-center gap-3 lg:flex-row-reverse">
        <ButtonGroup
          size="md"
          selectedKeys={new Set([view])}
          onSelectionChange={(keys) => {
            const next = Array.from(keys)[0] as TransactionView | undefined;
            if (next) onViewChange(next);
          }}
          className="hidden shrink-0 lg:inline-flex"
        >
          <ButtonGroupItem id="card" iconLeading={Grid01}>
            Card view
          </ButtonGroupItem>
          <ButtonGroupItem id="table" iconLeading={Rows01}>
            Table view
          </ButtonGroupItem>
        </ButtonGroup>

        <Input
          aria-label="Search transactions"
          placeholder="Search by reference, order, or amount"
          icon={SearchLg}
          size="md"
          value={search}
          onChange={onSearchChange}
          wrapperClassName="lg:w-80"
          data-testid="transactiontoolbar-input"
        />
      </div>
    </div>
  );
};

export default TransactionToolbar;
