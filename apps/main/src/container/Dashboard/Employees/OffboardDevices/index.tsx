"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import PageState from "@/components/PageState";
import { useAppDispatch, useAppSelector } from "@/store";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetSingleEmployeeQuery } from "@/api/baseQueries/companiesApi/employeesApi/getSingleEmployee";
import {
  addOffboardEmployees,
  removeOffboardEmployee,
  setOffboardReview,
} from "@/store/slices/employeeSlice";
import OffboardDevicesHeader from "./OffboardDevicesHeader";
import AddEmployeesModal from "./AddEmployeesModal";
import EmployeeSwitcherStrip, {
  toBasicEmployees,
} from "./EmployeeSwitcherStrip";
import EmployeeDevicesSection from "./EmployeeDevicesSection";
import OffboardDevicesFooter from "./OffboardDevicesFooter";
import { useOffboardDevicesState } from "./useOffboardDevicesState";
import { useRetrievalWindows } from "./useRetrievalWindows";
import { useOffboardReviewRestore } from "./useOffboardReviewRestore";
import { buildOffboardReview } from "./offboardReview";
import { useTrackOffboardingStarted } from "./useTrackOffboardingStarted";

const OffboardDevices = () => {
  const { push, replace, isPending: isNavigatePending } = useTransitionRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const companyId = useWorkspaceCompanyId();

  const offboardEmployees = useAppSelector(
    (state) => state.persistedReducers.employee?.offboardEmployees,
  );
  const review = useAppSelector(
    (state) => state.persistedReducers.employee?.offboardReview,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const count = offboardEmployees?.length ?? 0;
  const editEmployeeId = searchParams.get("employeeId");

  useEffect(() => {
    if (count === 0) replace(routes.EMPLOYEES);
  }, [count, replace]);

  const employees = useMemo(
    () => toBasicEmployees(offboardEmployees),
    [offboardEmployees],
  );

  const currentId = employees[currentIndex]?.id;

  const { currentData, isFetching, isError } = useGetSingleEmployeeQuery(
    { companyId: companyId as string, employeeId: currentId as string },
    { skip: !companyId || !currentId },
  );

  const fetchedEmployee = currentData?.data;
  const isCurrentEmployee = String(fetchedEmployee?.id) === currentId;
  const devices = useOffboardDevicesState();
  const windows = useRetrievalWindows();
  const { ensureLines, ensureLinesFromBuilt } = devices;
  const { getWindow, setWindow } = windows;

  useOffboardReviewRestore({
    editEmployeeId,
    employees,
    setCurrentIndex,
    currentId,
    fetchedEmployee,
    isCurrentEmployee,
    review,
    ensureLines,
    ensureLinesFromBuilt,
    getWindow,
    setWindow,
  });

  useTrackOffboardingStarted(currentId, fetchedEmployee, isCurrentEmployee);

  const handleRemoveById = (id: string) => {
    if (count <= 1) {
      push(routes.EMPLOYEES);
      return;
    }
    const removingIndex = employees.findIndex((employee) => employee.id === id);
    if (removingIndex === -1) return;
    setCurrentIndex((index) => {
      if (removingIndex < index) return index - 1;
      if (removingIndex === index) return Math.min(index, count - 2);
      return index;
    });
    dispatch(removeOffboardEmployee(id));
  };

  const handleReview = () => {
    dispatch(
      setOffboardReview(
        buildOffboardReview(
          employees,
          windows.getWindow,
          devices.getSelectedLines,
        ),
      ),
    );
    push(routes.EMPLOYEES_OFFBOARD_SUMMARY);
  };

  if (count === 0 || !currentId) return null;

  const employeeIds = employees.map((employee) => employee.id);
  const allWindowsAssigned = windows.allAssigned(employeeIds);
  const hasUnassignedReassign = devices.hasUnassignedReassign();
  const canReview = allWindowsAssigned && !hasUnassignedReassign;
  const reviewDisabledReason = !allWindowsAssigned
    ? "Select a retrieval window for every employee to continue."
    : hasUnassignedReassign
      ? "Pick an employee for every device set to reassign."
      : undefined;
  const sourceCountry =
    fetchedEmployee?.country ?? employees[currentIndex]?.country;
  const isPageLoading = isFetching && !isCurrentEmployee;
  const headerName =
    isCurrentEmployee && fetchedEmployee
      ? `${fetchedEmployee.first_name} ${fetchedEmployee.last_name}`.trim()
      : employees[currentIndex]?.name || "employee";

  const goPrev = () => setCurrentIndex((index) => Math.max(0, index - 1));
  const goNext = () =>
    setCurrentIndex((index) => Math.min(count - 1, index + 1));

  return (
    <div className="flex flex-col gap-6 py-8">
      <OffboardDevicesHeader employeeName={headerName} />

      <EmployeeSwitcherStrip
        employees={employees}
        currentIndex={currentIndex}
        onSwitch={setCurrentIndex}
        onPrev={goPrev}
        onNext={goNext}
        onAdd={() => setIsAddOpen(true)}
        onRemoveEmployee={handleRemoveById}
      />

      <PageState isLoading={isPageLoading} isError={isError}>
        <EmployeeDevicesSection
          key={currentId}
          currentId={currentId}
          sourceCountry={sourceCountry}
          excludeIds={employeeIds}
          devices={devices}
          windows={windows}
        />
      </PageState>

      <OffboardDevicesFooter
        multi={count > 1}
        isFirst={currentIndex === 0}
        isLast={currentIndex === count - 1}
        canReview={canReview}
        reviewDisabledReason={reviewDisabledReason}
        onCancel={() => push(routes.EMPLOYEES)}
        onPrevious={goPrev}
        onNext={goNext}
        onReview={handleReview}
        isCancelLoading={isNavigatePending}
        isReviewLoading={isNavigatePending}
      />

      <AddEmployeesModal
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        excludeIds={employees.map((employee) => employee.id)}
        onAdd={(added) => dispatch(addOffboardEmployees(added))}
      />
    </div>
  );
};

export default OffboardDevices;
