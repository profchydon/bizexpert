"use client";

import { Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ENTITIES_PAGE_SIZE } from "../constants/entitiesPagination";
import {
  useAccountsEntitiesPage,
  useAccountsPlan,
  useActingAdmin,
} from "../hooks/useAccountsData";
import { useEntitiesListState } from "../hooks/useEntitiesListState";
import { canCreateEntities } from "../utils/adminScope";
import { showScalePlanNotice } from "../utils/planTier";
import { TableListLocationProvider } from "@/hooks/tableListLocation";
import { SubsidiaryTable } from "./SubsidiaryTable";
import {
  accountsToolbarIconClass,
  accountsToolbarPrimaryButtonClass,
} from "./accountsTableToolbarClasses";

interface Props {
  onCreate: () => void;
}

export function SubsidiariesTab({ onCreate }: Props) {
  const {
    search,
    setSearch,
    debouncedSearch,
    statuses,
    setStatuses,
    page,
    setPage,
    hasActiveFilters,
  } = useEntitiesListState();
  const plan = useAccountsPlan();
  const acting = useActingAdmin();
  const { subsidiaries, total, lastPage, isListLoading, isError } =
    useAccountsEntitiesPage({
      page,
      perPage: ENTITIES_PAGE_SIZE,
      search: debouncedSearch,
      statuses,
    });

  const showPlanNotice = showScalePlanNotice(plan);
  const canCreate = canCreateEntities(acting);
  const showEmptyAccount =
    !isListLoading &&
    !hasActiveFilters &&
    total === 0 &&
    subsidiaries.length === 0;

  if (showEmptyAccount) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-gray-900">No entities yet</h2>
        <p className="max-w-md text-sm text-gray-600">
          Create your first entity to bill independently, with its own currency,
          card, and credit.
        </p>
        {canCreate && (
          <Button onClick={onCreate} data-testid="subsidiariestab-button">
            <Plus className="mr-2 size-4" />
            Create entity
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {showPlanNotice && (
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <Info className="mt-0.5 size-5 shrink-0 text-primary-700" />
          <p className="text-sm text-gray-600">
            Your plan includes your primary entity. Creating additional
            entities, each billed independently, needs the Scale plan.
          </p>
        </div>
      )}
      <TableListLocationProvider page={page}>
        <SubsidiaryTable
          subsidiaries={subsidiaries}
          total={total}
          page={page}
          totalPages={lastPage}
          onPageChange={setPage}
          query={search}
          onQueryChange={setSearch}
          statuses={statuses}
          onStatusesChange={setStatuses}
          isListLoading={isListLoading}
          isError={isError}
          hasActiveFilters={hasActiveFilters}
          action={
            canCreate ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                className={accountsToolbarPrimaryButtonClass}
                onClick={onCreate}
                data-testid="subsidiariestab-button-2"
              >
                <Plus className={accountsToolbarIconClass} />
                Create entity
              </Button>
            ) : undefined
          }
        />
      </TableListLocationProvider>
    </div>
  );
}
