"use client";

import { useEffect, useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { TableListLocationProvider } from "@/hooks/tableListLocation";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useOfficeParents } from "../hooks/useOfficeParents";
import { useOfficesPage } from "../hooks/useOfficesServer";
import { OfficeCreateLauncher } from "./OfficeCreateLauncher";
import { OfficesTable } from "./OfficesTable";

const OFFICES_PER_PAGE = 15;

function OfficesTabLoading() {
  return (
    <div
      className="grid min-h-0 w-full flex-1 place-content-center"
      aria-busy
      data-testid="officestab-loading"
    >
      <Loader />
    </div>
  );
}

export function OfficesTab() {
  const { page, setPage } = useTablePageQuery("offices_page");
  const { offices, total, lastPage, isLoading } = useOfficesPage({
    page,
    perPage: OFFICES_PER_PAGE,
  });
  const [parentSearch, setParentSearch] = useState("");
  const { parents, hasMore, isLoadingMore, loadMore } =
    useOfficeParents(parentSearch);
  const [filterId, setFilterId] = useState<string | null>(null);

  useEffect(() => {
    setFilterId(new URLSearchParams(window.location.search).get("subsidiary"));
  }, []);

  const filterName = filterId
    ? (parents.find((parent) => parent.id === filterId)?.name ??
      offices.find((office) => office.subsidiaryId === filterId)
        ?.subsidiaryName ??
      null)
    : null;
  const shown =
    filterId && filterName
      ? offices.filter((office) => office.subsidiaryId === filterId)
      : offices;

  if (isLoading) return <OfficesTabLoading />;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-900">No offices yet</h2>
        <p className="max-w-md text-sm text-gray-600">
          Offices operating under your entities will appear here.
        </p>
        <OfficeCreateLauncher
          parentOptions={parents}
          hasMoreParents={hasMore}
          isLoadingMoreParents={isLoadingMore}
          onLoadMoreParents={loadMore}
          parentSearch={parentSearch}
          onParentSearchChange={setParentSearch}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {filterName && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-sm text-gray-600">
            Showing offices for {filterName}.
          </p>
          <Button
            variant="link"
            size="sm"
            className="h-auto px-0 text-primary-700"
            onClick={() => setFilterId(null)}
            data-testid="officestab-button"
          >
            Show all offices
          </Button>
        </div>
      )}
      <TableListLocationProvider
        page={page}
        tab="offices"
        pageKey="offices_page"
      >
        <OfficesTable
          offices={shown}
          total={total}
          page={page}
          totalPages={lastPage}
          onPageChange={setPage}
          action={
            <OfficeCreateLauncher
              parentOptions={parents}
              size="sm"
              hasMoreParents={hasMore}
              isLoadingMoreParents={isLoadingMore}
              onLoadMoreParents={loadMore}
              parentSearch={parentSearch}
              onParentSearchChange={setParentSearch}
            />
          }
        />
      </TableListLocationProvider>
    </div>
  );
}
