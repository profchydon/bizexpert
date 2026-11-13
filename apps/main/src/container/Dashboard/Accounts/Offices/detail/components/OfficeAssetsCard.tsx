"use client";

import { useMemo, useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { Plus } from "lucide-react";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  REASSIGN_ASSIGNED_ASSET_MESSAGE,
  useOfficeBulkActions,
} from "../../hooks/useOfficeBulkActions";
import { useOfficeAssetsPage } from "../../hooks/useOfficeMembersServer";
import { useTableSelection } from "../../hooks/useTableSelection";
import { hasAssignedOfficeAssets } from "../../utils/isOfficeAssetAssigned";
import type { OfficeSnapshot, ServerOfficeArea } from "@/types/offices";
import type { Office } from "../../../types";
import type { OfficeAsset } from "../../types/officeAsset";
import { AssignOfficeAssetModal } from "./AssignOfficeAssetModal";
import {
  AWAITING_PLACEMENT_DESCRIPTION,
  awaitingPlacementCopy,
} from "../utils/awaitingPlacementCopy";
import {
  sortAssets,
  toggleMemberSort,
  type MemberSort,
} from "../utils/sortOfficeMembers";
import { OfficeAssetsTable } from "./OfficeAssetsTable";
import { OfficeBulkBar } from "./OfficeBulkBar";
import { OfficeMembersLoading } from "./OfficeMembersLoading";
import { OfficeSectionCard } from "./OfficeSectionCard";
import { ReassignOfficeModal } from "./ReassignOfficeModal";

interface Props {
  office: Office;
  areas: ServerOfficeArea[];
  snapshot?: OfficeSnapshot;
  onAdd: () => void;
  onNotify: (title: string, description: string) => void;
}

export function OfficeAssetsCard({
  office,
  areas,
  snapshot,
  onAdd,
  onNotify,
}: Props) {
  const [sort, setSort] = useState<MemberSort>({
    column: "",
    direction: "asc",
  });
  const { page, setPage } = useTablePageQuery("assets_page");
  const [assigning, setAssigning] = useState<OfficeAsset | null>(null);
  const active = office.status !== "closed";
  const { rows, total, lastPage, isLoading } = useOfficeAssetsPage(
    office.id,
    page,
    office.currency,
  );
  const pageRows = useMemo(() => sortAssets(rows, sort), [rows, sort]);
  const sel = useTableSelection(`${page}:${sort.column}:${sort.direction}`);
  const selectedAssets = useMemo(
    () => pageRows.filter((row) => sel.selected.has(row.id)),
    [pageRows, sel.selected],
  );
  const hasAssignedSelected = hasAssignedOfficeAssets(selectedAssets);
  const bulk = useOfficeBulkActions({
    office,
    kind: "assets",
    selectedIds: sel.selectedIds,
    onDone: sel.clear,
    onNotify,
    reassign: {
      disabled: hasAssignedSelected,
      disabledReason: hasAssignedSelected
        ? REASSIGN_ASSIGNED_ASSET_MESSAGE
        : undefined,
    },
  });

  const awaitingPlacement =
    office.status !== "closed" ? (snapshot?.awaiting_placement ?? 0) : 0;
  const countBadge = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-default">
            <Badge color="brand" size="sm" type="pill-color">
              {total}
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Devices and equipment held at this office.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <>
      <OfficeSectionCard
        title="Assets"
        badge={countBadge}
        action={
          active ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onAdd}
              data-testid="officeassetscard-button"
            >
              <Plus className="mr-2 size-4" />
              Add asset
            </Button>
          ) : undefined
        }
        bulkBar={
          active && sel.selected.size > 0 ? (
            <OfficeBulkBar
              count={sel.selected.size}
              actions={bulk.actions}
              onClear={sel.clear}
            />
          ) : undefined
        }
      >
        {awaitingPlacement > 0 && (
          <div className="mx-6 mt-4 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800">
            <p className="font-semibold">
              {awaitingPlacementCopy(awaitingPlacement)}
            </p>
            <p className="mt-1 text-warning-700">
              {AWAITING_PLACEMENT_DESCRIPTION}
            </p>
          </div>
        )}
        {isLoading ? (
          <OfficeMembersLoading />
        ) : total === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-semibold text-gray-900">No assets</p>
            <p className="mt-1 text-sm text-gray-600">
              {active
                ? "Add the devices and equipment kept at this office to see them here."
                : "This office has been closed."}
            </p>
          </div>
        ) : (
          <OfficeAssetsTable
            active={active}
            pageRows={pageRows}
            sort={sort}
            page={page}
            totalPages={lastPage}
            showPagination={lastPage > 1}
            selected={sel.selected}
            onSortChange={(column) => {
              setSort((current) => toggleMemberSort(current, column));
            }}
            onPageChange={setPage}
            onApplySelection={sel.applySelection}
            onAssign={setAssigning}
          />
        )}
      </OfficeSectionCard>
      <AssignOfficeAssetModal
        office={office}
        areas={areas}
        asset={assigning}
        onClose={() => setAssigning(null)}
        onAssigned={(summary) => onNotify("Device assigned", summary)}
        onNotify={onNotify}
      />
      <ReassignOfficeModal
        kind="assets"
        count={sel.selected.size}
        targets={bulk.targets}
        entityName={office.subsidiaryName}
        isOpen={bulk.reassignOpen}
        isConfirming={bulk.isReassigning}
        onClose={bulk.closeReassign}
        onConfirm={bulk.confirmReassign}
      />
    </>
  );
}
