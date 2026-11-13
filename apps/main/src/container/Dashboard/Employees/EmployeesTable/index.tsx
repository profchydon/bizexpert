import React, { useEffect, useMemo, useState } from "react";
import {
  useResetPageWhenValueChanges,
  useResetTablePage,
  useSearchFromQueryParam,
} from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { Badge } from "@/components/base/badges/badges";
import PageState from "@/components/PageState";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "next/navigation";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { EntityFilterBanner } from "@/container/Dashboard/Accounts/components/EntityFilterBanner";
import { resolveSubsidiaryName } from "@/container/Dashboard/Accounts/utils/subsidiaryNameById";
import { useVisibleSubsidiaries } from "@/container/Dashboard/Accounts/hooks/useAccountsData";
import routes from "@/routes";
import EmployeesEmptyTable from "../EmployeesEmptyTable";
import EmployeesSelectionHeader from "./EmployeesSelectionHeader";
import OffboardConfirmModal from "./OffboardConfirmModal";
import { useOffboardConfirm } from "./useOffboardConfirm";
import { useEmployeesTableData } from "./useEmployeesTableData";
import { useEmployeeSelection } from "./useEmployeeSelection";
import { useEquipEmployees } from "./useEquipEmployees";
import { useDepartmentResolver } from "./useDepartmentResolver";
import { EmployeesSelectionProvider } from "./selectionCheckboxes";
import { hasAssignedDevices } from "./employeeDevices";
import { employeeDetailPath } from "../employeeAddedDialogUtils";
import EmployeesTableControls from "./EmployeesTableControls";
import EmployeesTableHead from "./EmployeesTableHead";
import EmployeesTableRow from "./EmployeesTableRow";
import EmployeesTablePagination from "./EmployeesTablePagination";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  employeesTableShellClass,
  employeesTableTitleClass,
  employeesTableTitleRowClass,
} from "./employeesTableClasses";
import { resolveCountryText } from "@/utils/resolveCountryText";

interface Props {
  handleEditBtn: (value: string) => void;
}

const EmployeesTable: React.FC<Props> = ({ handleEditBtn }) => {
  const companyId = useWorkspaceCompanyId();
  const searchParams = useSearchParams();
  const countryId = searchParams.get("countryId") as string;
  const { activeEntityId: entityId } = useActiveWorkspace();
  const subsidiaries = useVisibleSubsidiaries();
  const [search, setSearch] = useState<string | null>(countryId ?? null);
  const [searchValue] = useDebounce(search, 2000);
  const [selectedFilterValue, setSelectedFilterValue] = useState<
    "active" | "archived"
  >("active");
  const { page, setPage } = useTablePageQuery();
  useResetTablePage(setPage, searchValue, selectedFilterValue);
  useResetPageWhenValueChanges(setPage, entityId);
  useSearchFromQueryParam(countryId, setSearch, setPage);

  const {
    employees,
    currentPage,
    lastPage,
    total,
    scopedTotal,
    tableIsLoading,
    tableIsError,
  } = useEmployeesTableData({
    companyId: companyId,
    searchValue,
    page,
    selectedFilterValue,
    entityId,
  });

  const selection = useEmployeeSelection(employees ?? []);
  const offboard = useOffboardConfirm(selection.selectedRows);
  const equip = useEquipEmployees(selection.selectedRows);
  const departmentById = useDepartmentResolver();

  const selectionApi = useMemo(
    () => ({
      selectedIds: selection.selectedIds,
      isAllPageSelected: selection.isAllPageSelected,
      isSomePageSelected: selection.isSomePageSelected,
      onToggleRow: selection.toggleRow,
      onToggleAllPage: selection.toggleAllPage,
    }),
    [selection],
  );

  useEffect(() => {
    selection.clearSelection();
  }, [selectedFilterValue, searchValue, selection.clearSelection]);

  const rows = employees ?? [];
  const showEmpty = !tableIsLoading && !tableIsError && rows.length === 0;

  return (
    <>
      {entityId && (
        <EntityFilterBanner
          entityName={
            resolveSubsidiaryName(entityId, subsidiaries) ?? "this entity"
          }
          count={scopedTotal ?? total ?? 0}
          noun="employee"
          clearHref={routes.EMPLOYEES}
        />
      )}

      <div className={employeesTableShellClass}>
        {selection.selectedRows.length > 0 ? (
          <EmployeesSelectionHeader
            selectedCount={selection.selectedRows.length}
            canOffboard={offboard.canOffboard}
            offboardDisabledReason={
              offboard.excludedCount > 0
                ? "Some selected employees have no assigned devices and can't be off-boarded."
                : undefined
            }
            onClear={selection.clearSelection}
            onEquip={equip.start}
            onOffboard={offboard.open}
            isEquipLoading={equip.isPending}
            isOffboardLoading={offboard.isPending}
          />
        ) : (
          <div className={employeesTableTitleRowClass}>
            <h2 className={employeesTableTitleClass}>Employees</h2>
            {total ? (
              <Badge color="brand" size="sm">
                {total} Employee{total === 1 ? "" : "s"}
              </Badge>
            ) : null}
          </div>
        )}

        <EmployeesTableControls
          tab={selectedFilterValue}
          onTabChange={setSelectedFilterValue}
          search={search}
          onSearchChange={(value) => setSearch(value)}
        />

        <PageState isLoading={tableIsLoading} isError={tableIsError}>
          <EmployeesSelectionProvider value={selectionApi}>
            {showEmpty ? (
              <EmployeesEmptyTable />
            ) : (
              <>
                <EmployeesTableHead />
                {rows.map((employee) => (
                  <EmployeesTableRow
                    key={employee.id}
                    employee={employee}
                    departmentById={departmentById}
                    selectedFilterValue={selectedFilterValue}
                    canOffboard={hasAssignedDevices(employee)}
                    canEquip={Boolean(resolveCountryText(employee.country))}
                    onEdit={() => handleEditBtn(String(employee.id))}
                    viewHref={employeeDetailPath(String(employee.id), page)}
                    onEquip={() => equip.equipOne(employee)}
                    onOffboard={() => offboard.offboardOne(employee)}
                    isEquipLoading={equip.isRowLoading(String(employee.id))}
                    isOffboardLoading={offboard.isRowLoading(
                      String(employee.id),
                    )}
                  />
                ))}
                <EmployeesTablePagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPageChange={setPage}
                />
              </>
            )}
          </EmployeesSelectionProvider>
        </PageState>
      </div>

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
};

export default EmployeesTable;
