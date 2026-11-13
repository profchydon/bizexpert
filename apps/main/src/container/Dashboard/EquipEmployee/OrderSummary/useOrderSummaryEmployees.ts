"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { STORAGE_ACTIONS_FLOW } from "@/app/dashboard/NavBar/useStorageActionsCheckout";
import { useStorageUnifiedOrder } from "@/container/Dashboard/Storage/Remote/hooks/useStorageUnifiedOrder";
import { applyStorageDeployRecipients } from "@/container/Dashboard/Storage/Remote/utils/storageDeployRecipient";
import { useAppSelector } from "@/store";
import type { IEmployees } from "@/types/employees";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";

export const useOrderSummaryEmployees = () => {
  const searchParams = useSearchParams();
  const unifiedOrder = useStorageUnifiedOrder();
  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];
  const isStorageActionsFlow =
    searchParams.get("flow") === STORAGE_ACTIONS_FLOW;
  const employeesWithItems = useMemo(() => {
    const withItems = (employees || []).filter((employee) =>
      Boolean(employee?.items?.length),
    );
    if (!isStorageActionsFlow) return withItems;
    return applyStorageDeployRecipients(withItems, unifiedOrder?.actionItems);
  }, [employees, isStorageActionsFlow, unifiedOrder?.actionItems]);
  const getEmployeeCountryId = () => employeesWithItems?.[0]?.country_id;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(employeesWithItems.length));

  useEffect(() => {
    setCurrentPage((prevPage) => Math.min(prevPage, totalPages));
  }, [totalPages]);

  const currentItems = employeesWithItems?.slice(currentPage - 1, currentPage);
  const isUnassigned = currentItems[0]?.id === UNASSIGNED_ORDER_SUMMARY_KEY;

  const hasAssignedEmployees = employeesWithItems?.some(
    (employee) =>
      employee?.id !== UNASSIGNED_ORDER_SUMMARY_KEY &&
      Boolean(employee?.items?.length),
  );
  const hasUnassignedStorageGroup = employeesWithItems?.some(
    (employee) =>
      employee?.id === UNASSIGNED_ORDER_SUMMARY_KEY &&
      Boolean(employee?.items?.length),
  );
  const isStorageOnlyFlow = hasUnassignedStorageGroup && !hasAssignedEmployees;
  const hasApprovalRequest = employeesWithItems.some(
    ({ requestId }) => requestId,
  );

  const goToNextPage = () =>
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  return {
    currentItems,
    currentPage,
    employeesWithItems,
    getEmployeeCountryId,
    goToNextPage,
    goToPreviousPage,
    hasApprovalRequest,
    isStorageOnlyFlow,
    isUnassigned,
    totalPages,
  };
};
