"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { useSignAgreementMutation } from "@/api/baseQueries/companiesApi/signAgreementApi";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { userApi } from "@/api/baseQueries/userApi";
import TermsAndConditionsModal from "../TermsAndConditionsModal";
import NextStepModal from "../NextStepModal";
import ChecklistModal from "../ChecklistModal";
import PageState from "@/components/PageState";
import { setEncryptAuth } from "@/store/slices/authSlice";
import { encryptAuthData } from "@/utils/encryption/encryptAuthData";
import AddEmployees from "../EquipEmployee/Employee/AddEmployees";
import type { EmployeeAddTab } from "../EquipEmployee/Employee/AddEmployees/addEmployeesPanelTabs";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { EntityOverviewBody } from "./EntityOverviewBody";
import { GlobalOverviewBody } from "./GlobalOverviewBody";
import { OfficeOverviewBody } from "./OfficeOverviewBody";
import { resolveOverviewTier } from "./overviewTier";
import {
  overviewPageIsError,
  overviewPageIsLoading,
  shouldRenderEntityOverview,
} from "./overviewPageState";
import {
  resolveOverviewDashboardData,
  shouldBlockOverviewOnDashboardError,
} from "./overviewDashboardError";
import { showApiError } from "@/utils/showApiError";

const Overview = () => {
  const dispatch = useAppDispatch();
  const { access, activeEntityId } = useActiveWorkspace();

  const {
    getCompanyDetails,
    getAuthToken,
    getUserDetails,
    getEntityMemberships,
  } = useAuthUserDetail();
  const company = getCompanyDetails();
  const auth_token = getAuthToken();
  const user = getUserDetails();

  const isTermAgreed = company?.agreement_signed_at;
  const [signAgreement, signAgreementProps] = useSignAgreementMutation();

  const [isNextStepOpen, setIsNextStepOpen] = useState(false);
  const [addEmployeesTab, setAddEmployeesTab] = useState<EmployeeAddTab | null>(
    null,
  );
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  const handleSetupComplete = (tab: EmployeeAddTab) => {
    setIsNextStepOpen(false);
    setAddEmployeesTab(tab);
  };

  const {
    data: dashboadRes,
    isError,
    isLoading,
    refetch,
  } = useWorkspaceDashboardQuery({ skip: !company });
  const dashboardData = resolveOverviewDashboardData(
    dashboadRes?.data,
    isError,
    activeEntityId,
  );
  const blockDashboardError = shouldBlockOverviewOnDashboardError(
    isError,
    activeEntityId,
  );
  const tier = resolveOverviewTier({
    isGlobalAdmin: access.isGlobalAdmin,
    activeEntityId,
    actingRole: access.actingRole,
    officeAdminOfficeIds: access.officeAdminOfficeIds,
  });
  const pageIsError = overviewPageIsError({
    tier,
    dashboardError: isError,
  });
  const pageIsLoading = overviewPageIsLoading({
    tier,
    dashboardLoading: isLoading,
    hasDashboardData: Boolean(dashboardData),
  });

  const onAgree = async () => {
    if (!company?.id) {
      return;
    }

    await signAgreement({ companyId: company.id })
      .unwrap()
      .then((res) => {
        dispatch(userApi.util.invalidateTags(["User"]));
        dispatch(
          setEncryptAuth(
            encryptAuthData({
              auth_token,
              user,
              company: {
                ...company,
                agreement_signed_at: res.data.agreement_signed_at,
              },
              entities: getEntityMemberships(),
            }),
          ),
        );
        setIsNextStepOpen(true);
      })
      .catch(showApiError);
  };

  useEffect(() => {
    refetch();
  }, [activeEntityId, refetch]);

  return (
    <PageState
      isError={pageIsError || blockDashboardError}
      isLoading={pageIsLoading}
    >
      <div className="pb-12 pt-6">
        {dashboardData && tier === "office" ? (
          <OfficeOverviewBody dashboardData={dashboardData} />
        ) : null}
        {shouldRenderEntityOverview(tier, activeEntityId) && activeEntityId ? (
          <EntityOverviewBody
            entityId={activeEntityId}
            dashboardData={dashboardData}
          />
        ) : null}
        {dashboardData && tier === "global" ? (
          <GlobalOverviewBody dashboardData={dashboardData} />
        ) : null}

        <TermsAndConditionsModal
          isOpen={Boolean(!isTermAgreed)}
          onClose={() => null}
          isLoading={signAgreementProps.isLoading}
          onAgree={onAgree}
        />
        <NextStepModal
          isOpen={isNextStepOpen}
          onClose={() => setIsNextStepOpen(false)}
          onComplete={handleSetupComplete}
        />
        {addEmployeesTab && (
          <AddEmployees
            isOpen
            initialTab={addEmployeesTab}
            onClose={() => setAddEmployeesTab(null)}
            employeepage_instance
          />
        )}
        <ChecklistModal
          isOpen={isChecklistModalOpen}
          onClose={() => setIsChecklistModalOpen(!isChecklistModalOpen)}
        />
      </div>
    </PageState>
  );
};

export default Overview;
