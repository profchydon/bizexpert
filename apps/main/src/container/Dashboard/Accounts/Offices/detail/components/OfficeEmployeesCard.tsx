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
import OffboardConfirmModal from "@/container/Dashboard/Employees/EmployeesTable/OffboardConfirmModal";
import { useOffboardConfirm } from "@/container/Dashboard/Employees/EmployeesTable/useOffboardConfirm";
import {
  OFFBOARD_NO_DEVICES_MESSAGE,
  useOfficeBulkActions,
} from "../../hooks/useOfficeBulkActions";
import { useOfficeEmployeesPage } from "../../hooks/useOfficeMembersServer";
import { useTableSelection } from "../../hooks/useTableSelection";
import type { Office } from "../../../types";
import {
  sortEmployees,
  toggleMemberSort,
  type MemberSort,
} from "../utils/sortOfficeMembers";
import { OfficeBulkBar } from "./OfficeBulkBar";
import { OfficeEmployeesTable } from "./OfficeEmployeesTable";
import { OfficeMembersLoading } from "./OfficeMembersLoading";
import { OfficeSectionCard } from "./OfficeSectionCard";
import { ReassignOfficeModal } from "./ReassignOfficeModal";

interface Props {
  office: Office;
  onAdd: () => void;
  onNotify: (title: string, description: string) => void;
}

export function OfficeEmployeesCard({ office, onAdd, onNotify }: Props) {
  const [sort, setSort] = useState<MemberSort>({
    column: "",
    direction: "asc",
  });
  const { page, setPage } = useTablePageQuery("employees_page");
  const active = office.status !== "closed";
  const { rows, rawRows, total, lastPage, isLoading } = useOfficeEmployeesPage(
    office.id,
    page,
  );
  const pageRows = useMemo(() => sortEmployees(rows, sort), [rows, sort]);
  const sel = useTableSelection(`${page}:${sort.column}:${sort.direction}`);
  const selectedEmployees = useMemo(
    () => rawRows.filter((row) => sel.selected.has(String(row.id ?? ""))),
    [rawRows, sel.selected],
  );
  const offboard = useOffboardConfirm(selectedEmployees);
  const bulk = useOfficeBulkActions({
    office,
    kind: "employees",
    selectedIds: sel.selectedIds,
    onDone: sel.clear,
    onNotify,
    offboard: {
      onClick: offboard.open,
      disabled: !offboard.canOffboard,
      disabledReason: offboard.canOffboard
        ? undefined
        : OFFBOARD_NO_DEVICES_MESSAGE,
    },
  });

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
        <TooltipContent>Employees based at this office.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <>
      <OfficeSectionCard
        title="Employees"
        badge={countBadge}
        action={
          active ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onAdd}
              data-testid="officeemployeescard-button"
            >
              <Plus className="mr-2 size-4" />
              Add employee
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
        {isLoading ? (
          <OfficeMembersLoading />
        ) : total === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-semibold text-gray-900">No employees</p>
            <p className="mt-1 text-sm text-gray-600">
              {active
                ? "Add the people based at this office to see them here."
                : "This office has been closed."}
            </p>
          </div>
        ) : (
          <OfficeEmployeesTable
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
          />
        )}
      </OfficeSectionCard>
      <ReassignOfficeModal
        kind="employees"
        count={sel.selected.size}
        targets={bulk.targets}
        entityName={office.subsidiaryName}
        isOpen={bulk.reassignOpen}
        isConfirming={bulk.isReassigning}
        onClose={bulk.closeReassign}
        onConfirm={bulk.confirmReassign}
      />
      <OffboardConfirmModal
        isOpen={offboard.isOpen}
        onOpenChange={offboard.setIsOpen}
        count={offboard.offboardableRows.length}
        excludedCount={offboard.excludedCount}
        onContinue={offboard.start}
        isContinueLoading={offboard.isPending}
      />
    </>
  );
}
