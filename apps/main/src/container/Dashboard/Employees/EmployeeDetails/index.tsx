"use client";
import PageHeader from "@/components/PageHeader";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import routes from "@/routes";
import DetailsLayout from "./DetailsLayout";
import { useAppDispatch, useAppSelector } from "@/store";
import { useGetSingleEmployeeQuery } from "@/api/baseQueries/companiesApi/employeesApi/getSingleEmployee";
import InvitationEmployeeModal from "./InvitationEmployeeModal";
import { useDeleteEmployeeMutation } from "@/api/baseQueries/companiesApi/employeesApi/deletEmployee";
import { DeleteEmployeeRequest, IEmployees } from "@/types/employees";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { handleUnexpectedAsyncError } from "@/utils/handleUnexpectedAsyncError";
import PageState from "@/components/PageState";
import { useInviteEmployeesMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/inviteEmployees";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resetOffboardingData } from "@/store/slices/offboardingSlice";
import { Offboard_asset } from "@/types/offboarding";
import { removeItemsNotCompleted } from "@/components/Offboarding/util";
import AddEmployees from "../../EquipEmployee/Employee/AddEmployees";
import {
  duplicatedEmployeeRedirectPath,
  duplicateEmployeeSearch,
} from "./duplicateEmployee";
import EmployeeDetailViewActions from "./EmployeeDetailViewActions";

const EmployeeDetails = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const param = useParams();
  const employeeId = param?.employeeId as string;

  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const companyAdmin = getUserDetails();

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);
  const [isDuplicateEmployeeOpen, setIsDuplicateEmployeeOpen] = useState(false);
  const shouldSkipDuplicateCloseRoute = useRef(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const {
    data: getSingleEmployee,
    isLoading,
    isError,
  } = useGetSingleEmployeeQuery(
    { companyId: companyId!, employeeId: employeeId! },
    { skip: !companyId || !employeeId },
  );

  const singleEmployee = getSingleEmployee?.data;
  const [deleteEmployee, deleteEmployeeProps] = useDeleteEmployeeMutation();
  const [inviteAdmins, inviteAdminsProps] = useInviteEmployeesMutation();

  const onInvite = async () => {
    const data = {
      companyId: company?.id as string,
      payload: {
        emails: [singleEmployee?.email as string],
        role: "Basic",
      },
    };

    const { success } = await inviteAdmins(data).unwrap();
    if (success) {
      displaySuccessMessage("Invite sent successfully");
    }

    setIsInviteModalOpen(false);
  };

  const actionsDB = useMemo(() => {
    if (!offboardingData) {
      return [];
    }
    if (Array.isArray(offboardingData)) {
      return offboardingData;
    }
    return [offboardingData];
  }, [offboardingData]) as Offboard_asset[];

  const handleDeleteEmployee = async () => {
    const payload = {
      companyId: companyId as string,
      employeeId: employeeId,
    } as DeleteEmployeeRequest;
    try {
      await deleteEmployee(payload)
        .unwrap()
        .then((res) => {
          displaySuccessMessage(
            "Employee deleted successfully",
            "The employee has been deleted from the company roster.",
          );
          router.replace("/dashboard/employees");
        });
    } catch (error) {
      handleUnexpectedAsyncError(error, "Unable to delete employee");
    }
  };

  const openDuplicateEmployee = () => {
    const search = duplicateEmployeeSearch(singleEmployee);
    globalThis.history.replaceState(
      null,
      "",
      `${routes.EMPLOYEES}/${employeeId}${search ? `?${search}` : ""}`,
    );
    setIsDuplicateEmployeeOpen(true);
  };

  const closeDuplicateEmployee = () => {
    setIsDuplicateEmployeeOpen(false);

    if (shouldSkipDuplicateCloseRoute.current) {
      shouldSkipDuplicateCloseRoute.current = false;
      return;
    }

    router.replace(`${routes.EMPLOYEES}/${employeeId}`);
  };

  const handleDuplicatedEmployeeAdded = (employee: IEmployees) => {
    const redirectPath = duplicatedEmployeeRedirectPath(employee);
    if (!redirectPath) return;

    shouldSkipDuplicateCloseRoute.current = true;
    setIsDuplicateEmployeeOpen(false);
    router.push(redirectPath);
  };

  useEffect(() => {
    removeItemsNotCompleted(offboardingData, dispatch);
  }, []);

  useEffect(() => {
    dispatch(resetOffboardingData());
  }, []);

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={[
          <Link href={routes.EMPLOYEES}>Manage Employees</Link>,
          <span className="text-primary-600">View Employee</span>,
        ]}
        pageTitle="View Employee"
        pageDescription="See everything about your employee at a glance"
        onBack={() => router.back()}
      >
        <div className="flex flex-wrap items-center gap-3">
          <EmployeeDetailViewActions
            employee={singleEmployee}
            actionsCount={actionsDB?.length}
            companyAdminId={companyAdmin?.id}
            deleteLoading={deleteEmployeeProps?.isLoading}
            onDelete={handleDeleteEmployee}
            onDuplicate={openDuplicateEmployee}
            onShareInvite={() => setIsInviteModalOpen(true)}
            onViewPendingActions={() => setIsActionDrawerOpen(true)}
          />
        </div>
      </PageHeader>

      <PageState isLoading={isLoading} isError={isError}>
        <DetailsLayout
          baseRoute={routes.EMPLOYEES}
          employeeData={singleEmployee}
          isActionDrawerOpen={isActionDrawerOpen}
          setIsActionDrawerOpen={(value) => setIsActionDrawerOpen(value)}
        />
      </PageState>

      <InvitationEmployeeModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={onInvite}
        isButtonDisabled={inviteAdminsProps.isLoading}
        employee={singleEmployee as IEmployees}
      />
      {isDuplicateEmployeeOpen && (
        <AddEmployees
          isOpen={isDuplicateEmployeeOpen}
          onClose={closeDuplicateEmployee}
          employeepage_instance
          employeeViewpage_instance
          initialTab="add"
          onEmployeeAdded={handleDuplicatedEmployeeAdded}
          suppressRouteSync
        />
      )}
    </div>
  );
};

export default EmployeeDetails;
