"use client";

import { useState } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { TableListLocationProvider } from "@/hooks/tableListLocation";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { useGetTransactionsQuery } from "@/api/baseQueries/companiesApi/transactionsApi/getTransactions";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import Loader from "@/components/Loader";
import Pagination from "@/components/Custom/Pagination";
import InvoiceToolbar from "./InvoiceToolbar";
import InvoiceCardView from "./InvoiceCardView";
import InvoiceTableView from "./InvoiceTableView";
import { filterInvoicesBySearch } from "./filterInvoicesBySearch";
import {
  invoiceFilterToApiParam,
  type InvoiceFilter,
  type InvoiceView,
} from "./invoiceFilterMeta";

const InvoiceList = () => {
  const companyId = useWorkspaceCompanyId();
  const [filter, setFilter] = useState<InvoiceFilter>("all");
  const [view, setView] = useState<InvoiceView>("table");
  const [search, setSearch] = useState("");
  const { page, setPage } = useTablePageQuery();
  const perPage = 10;

  const {
    data: getTransactions,
    isLoading,
    isFetching,
    isError,
  } = useGetTransactionsQuery(
    {
      companyId: companyId!,
      params: {
        invoice: invoiceFilterToApiParam(filter),
        page,
        per_page: perPage,
      },
    },
    { skip: !companyId },
  );

  useResetTablePage(setPage, filter, search);

  const invoices = filterInvoicesBySearch(getTransactions?.data?.data, search);
  const currentPage = getTransactions?.data?.current_page ?? page;
  const lastPage = getTransactions?.data?.last_page ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <InvoiceToolbar
        search={search}
        filter={filter}
        view={view}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onViewChange={setView}
      />

      {isLoading || isFetching ? (
        <div className="grid place-content-center py-16">
          <Loader />
        </div>
      ) : (
        <TableListLocationProvider page={page}>
          {view === "card" ? (
            <InvoiceCardView
              transactions={invoices}
              query={search}
              filter={filter}
            />
          ) : (
            <InvoiceTableView
              transactions={invoices}
              query={search}
              filter={filter}
            />
          )}
        </TableListLocationProvider>
      )}

      {isError && (
        <p className="text-sm text-error-600">
          Failed to load invoices. Please try again.
        </p>
      )}

      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export default InvoiceList;
