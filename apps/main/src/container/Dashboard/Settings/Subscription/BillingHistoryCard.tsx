"use client";

import { useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import type { SortDescriptor } from "react-aria-components";
import { useDebounce } from "use-debounce";
import config from "@/config/config";
import { useGetSubscriptionInvoicesQuery } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import type { SubscriptionBillingInvoice } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { TablePaginationFooter } from "@/components/application/pagination/table-pagination-footer";
import { TableCard } from "@/components/application/table/table";
import { Button } from "@/components/base/buttons/button";
import { BillingHistoryTable } from "./BillingHistoryTable";
import { BillingHistoryToolbar } from "./BillingHistoryToolbar";
import { BillingInvoiceModal } from "./BillingInvoiceModal";
import {
  INVOICE_PAGE_SIZES,
  billingHistoryEmpty,
  billingSortBy,
  invoiceDownloadUrl,
  parseBillingInvoiceList,
} from "./billingInvoices";

export function BillingHistoryCard({
  companyId,
  isFree,
  freePlanName,
}: {
  companyId?: string;
  isFree: boolean;
  freePlanName: string;
}) {
  const { page, setPage } = useTablePageQuery("billing_page");
  const [pageSize, setPageSize] = useState(INVOICE_PAGE_SIZES[0]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<SubscriptionBillingInvoice | null>(
    null,
  );
  const [sort, setSort] = useState<SortDescriptor>({
    column: "billed_on",
    direction: "descending",
  });
  const [debouncedSearch] = useDebounce(search, 300);
  const filtering = Boolean(debouncedSearch.trim() || status);
  const query = useGetSubscriptionInvoicesQuery(
    {
      companyId,
      page,
      perPage: pageSize,
      search: debouncedSearch.trim() || undefined,
      status: status || undefined,
      sortBy: billingSortBy(sort.column),
      sortOrder: sort.direction === "ascending" ? "asc" : "desc",
    },
    { skip: !companyId },
  );
  const list = parseBillingInvoiceList(query.data);
  const empty = billingHistoryEmpty({ filtering, isFree, freePlanName });
  const downloadFor = (invoice: SubscriptionBillingInvoice) =>
    invoiceDownloadUrl(invoice.links.download, config.API_URL ?? "");
  const clear = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  return (
    <TableCard.Root className="overflow-visible">
      <TableCard.Header
        title="Billing history"
        description="Every subscription charge on this account, most recent first."
        contentTrailing={
          list.total > 0 || filtering ? (
            <BillingHistoryToolbar
              search={search}
              status={status}
              onSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onStatus={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
          ) : null
        }
      />
      {query.isLoading ? (
        <p className="px-6 py-10 text-sm text-tertiary">
          Loading billing history
        </p>
      ) : query.isError ? (
        <p className="px-6 py-10 text-sm text-tertiary">
          Billing history could not be loaded.
        </p>
      ) : list.data.length === 0 ? (
        <div className="px-6 py-10">
          <EmptyState size="sm">
            <EmptyState.Header pattern="none">
              <EmptyState.Illustration type="credit-card" color="gray" />
            </EmptyState.Header>
            <EmptyState.Content>
              <EmptyState.Title>{empty.title}</EmptyState.Title>
              <EmptyState.Description>
                {empty.description}
              </EmptyState.Description>
            </EmptyState.Content>
            {empty.clear ? (
              <Button
                color="secondary"
                size="sm"
                onClick={clear}
                data-testid="billinghistorycard-button"
              >
                Clear search and filters
              </Button>
            ) : null}
          </EmptyState>
        </div>
      ) : (
        <BillingHistoryTable
          rows={list.data}
          sort={sort}
          onSortChange={(next) => {
            setSort(next);
            setPage(1);
          }}
          onView={setSelected}
          downloadUrl={downloadFor}
        />
      )}
      {list.total > pageSize || list.last_page > 1 ? (
        <TablePaginationFooter
          currentPage={list.current_page}
          itemsPerPage={pageSize}
          totalItems={list.total}
          totalPages={list.last_page}
          pageSizeOptions={INVOICE_PAGE_SIZES}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      ) : null}
      <BillingInvoiceModal
        companyId={companyId}
        invoice={selected}
        downloadUrl={selected ? downloadFor(selected) : null}
        onClose={() => setSelected(null)}
      />
    </TableCard.Root>
  );
}
