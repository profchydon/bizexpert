"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { IEmployees } from "@/types/employees";
import AddEmployeeSlideoutTab from "./AddEmployeeSlideoutTab";
import { AddEmployeesSlideoutShell } from "./addEmployeesSlideoutShell";
import type { EmployeeAddTab } from "./addEmployeesPanelTabs";
import { HrisFinchManageModal } from "./hris/HrisFinchManageModal";
import type { HrisFinchManageState } from "./hris/hrisFinchManageState";
import HrisIntegrations from "./HrisIntegrations";
import ImportEmployee from "./ImportEmployee";
import InviteEmployee from "./InviteEmployees";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  employeepage_instance?: boolean;
  initialTab?: EmployeeAddTab;
  hideTabs?: boolean;
  disabledTabs?: EmployeeAddTab[];
  onEmployeeAdded?: (employee: IEmployees) => void;
  initialCountry?: string;
  suppressRouteSync?: boolean;
  lockCountryToInitial?: boolean;
  employeeViewpage_instance?: boolean;
  /** Adds the employee to this company instead of the active workspace. */
  companyId?: string;
}

const AddEmployees = ({
  isOpen,
  onClose,
  onOpen,
  employeepage_instance = false,
  initialTab = "import",
  hideTabs = false,
  disabledTabs = [],
  onEmployeeAdded,
  initialCountry,
  suppressRouteSync = true,
  lockCountryToInitial = false,
  companyId,
}: Props) => {
  const [tabState, setTabState] = useState<EmployeeAddTab>(initialTab);
  const [finchManage, setFinchManage] = useState<HrisFinchManageState | null>(
    null,
  );
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const integrationParam = searchParams.get("integration");
  const codeParam = searchParams.get("code");

  useEffect(() => {
    if (tabParam === "hris" || integrationParam || codeParam) {
      setTabState("hris");
      return;
    }
    setTabState(initialTab);
  }, [codeParam, initialTab, integrationParam, isOpen, tabParam]);

  return (
    <>
      <AddEmployeesSlideoutShell
        isOpen={isOpen && !finchManage}
        onClose={onClose}
        activeTab={tabState}
        onTabChange={setTabState}
        hideTabs={hideTabs}
        disabledTabs={disabledTabs}
      >
        {tabState === "import" ? (
          <ImportEmployee
            onClose={onClose}
            employeepage_instance={employeepage_instance}
          />
        ) : null}

        {tabState === "invite" ? (
          <div className="overflow-y-auto p-6">
            <InviteEmployee />
          </div>
        ) : null}

        {tabState === "add" ? (
          <AddEmployeeSlideoutTab
            onClose={onClose}
            onAfterAdd={() => setTabState("import")}
            employeepage_instance={employeepage_instance}
            onEmployeeAdded={onEmployeeAdded}
            initialCountry={initialCountry}
            suppressRouteSync={suppressRouteSync}
            lockCountryToInitial={lockCountryToInitial}
            companyId={companyId}
          />
        ) : null}

        {tabState === "hris" ? (
          <HrisIntegrations
            onClose={onClose}
            onOpen={onOpen}
            finchManageOpen={Boolean(finchManage)}
            onOpenFinchManage={setFinchManage}
          />
        ) : null}
      </AddEmployeesSlideoutShell>

      <HrisFinchManageModal
        state={finchManage}
        onClose={() => setFinchManage(null)}
      />
    </>
  );
};

export default AddEmployees;
