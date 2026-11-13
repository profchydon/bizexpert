"use client";

import type { Key } from "react-aria-components";
import { SearchLg } from "@untitledui/icons";
import PageState from "@/components/PageState";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { TablePaginationFooter } from "@/components/application/pagination/table-pagination-footer";
import { Table, TableCard } from "@/components/application/table/table";
import { Tabs } from "@/components/application/tabs/tabs";
import { Badge } from "@/components/base/badges/badges";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import {
  ORDERS_COLUMNS,
  ORDERS_PAGE_SIZE_OPTIONS,
} from "../constants/ordersTabConstants";
import {
  MOVEMENT_ITEMS,
  useOrdersTabController,
} from "../hooks/useOrdersTabController";
import type { StorageOrder } from "../types/storage";
import { LoadErrorState, NoMatchesState } from "./StorageEmptyStates";
import { StorageOrderRow } from "./StorageOrderRow";

interface Props {
  onOpen: (order: StorageOrder) => void;
}

export function OrdersTab({ onOpen }: Props) {
  const c = useOrdersTabController(onOpen);
  const { api } = c;

  const tableBody = () => {
    if (api.isError) {
      return <LoadErrorState onRetry={() => void api.refetch()} />;
    }
    if (api.isLoading) {
      return (
        <PageState isLoading isError={false}>
          <span />
        </PageState>
      );
    }
    if (api.isServiceFilter) {
      return (
        <EmptyState size="sm" className="py-12">
          <EmptyState.Header pattern="none">
            <EmptyState.Illustration type="documents" color="gray" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>No orders here</EmptyState.Title>
            <EmptyState.Description>
              Devices entering or leaving storage, checks, deployments, and
              disposals will show up here so you can track them.
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState>
      );
    }
    if (api.orders.length === 0) {
      if (c.hasActiveSearch) {
        return (
          <NoMatchesState
            onClear={c.clearSearch}
            title="No orders match this search"
            description="Try a different order ID, device name, or serial number."
          />
        );
      }
      return (
        <EmptyState size="sm" className="py-12">
          <EmptyState.Header pattern="none">
            <EmptyState.Illustration type="documents" color="gray" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>No orders here</EmptyState.Title>
            <EmptyState.Description>
              Devices entering or leaving storage, checks, deployments, and
              disposals will show up here so you can track them.
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState>
      );
    }
    return (
      <Table
        aria-label="Storage orders"
        className="[&_td]:whitespace-nowrap [&_th]:whitespace-nowrap"
      >
        <Table.Header columns={ORDERS_COLUMNS}>
          {(col) => (
            <Table.Head
              id={col.id}
              label={col.name}
              isRowHeader={col.id === "id"}
            />
          )}
        </Table.Header>
        <Table.Body items={api.orders}>
          {(order) => (
            <StorageOrderRow order={order} onOpen={() => c.onOpen(order)} />
          )}
        </Table.Body>
      </Table>
    );
  };

  return (
    <TableCard.Root className="overflow-visible">
      <TableCard.Header
        title="Orders"
        badge={
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200 ring-inset">
            {api.pagination.total}
          </span>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary px-5 py-3">
        <Tabs
          className="w-fit"
          selectedKey={c.statusTab}
          onSelectionChange={(k: Key) => {
            c.setStatusTab(k as typeof c.statusTab);
          }}
        >
          <Tabs.List type="button-border" items={c.statusTabs}>
            {(item) => {
              const t = item as (typeof c.statusTabs)[number];
              return (
                <Tabs.Item id={t.id}>
                  {(s) => (
                    <div className="flex items-center gap-1.5">
                      <span>{t.label}</span>
                      <Badge
                        size="sm"
                        type="pill-color"
                        color={s.isSelected ? "brand" : "gray"}
                      >
                        {t.count}
                      </Badge>
                    </div>
                  )}
                </Tabs.Item>
              );
            }}
          </Tabs.List>
        </Tabs>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <Select
            aria-label="Filter by movement"
            size="sm"
            selectedKey={c.movement}
            items={MOVEMENT_ITEMS}
            onSelectionChange={(k) => {
              c.setMovement((k as typeof c.movement) ?? "all");
            }}
            className="w-44"
            data-testid="orderstab-select"
          >
            {(i) => <Select.Item id={i.id}>{i.label}</Select.Item>}
          </Select>
          <div className="min-w-[260px] flex-1 sm:flex-none">
            <Input
              size="sm"
              icon={SearchLg}
              aria-label="Search orders"
              placeholder="Search order, device, serial"
              value={c.search}
              onChange={c.setSearch}
              data-testid="orderstab-input"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">{tableBody()}</div>
      {c.showPagination && !api.isLoading && !api.isError && (
        <TablePaginationFooter
          currentPage={api.pagination.currentPage}
          itemsPerPage={api.pagination.perPage}
          totalItems={api.pagination.total}
          totalPages={api.pagination.lastPage}
          pageSizeOptions={[...ORDERS_PAGE_SIZE_OPTIONS]}
          onPageChange={c.setPage}
          onPageSizeChange={(size) => {
            c.setPageSize(size);
            c.resetPage();
          }}
        />
      )}
    </TableCard.Root>
  );
}
