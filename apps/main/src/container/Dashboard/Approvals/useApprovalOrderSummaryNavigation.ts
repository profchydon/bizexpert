"use client";

import { useRouter } from "next/navigation";

import { useLazyGetSingleEmployeeQuery } from "@/api/baseQueries/companiesApi/employeesApi/getSingleEmployee";
import { useAppDispatch } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  approvalOrderSummaryPath,
  approvalRequestToAssignedEmployees,
} from "./approvalAssignment";
import type { ApprovalActionOptions, ApprovalRecord } from "./types";

export function useApprovalOrderSummaryNavigation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const companyId = useWorkspaceCompanyId();
  const [getEmployeeDetail] = useLazyGetSingleEmployeeQuery();

  return async ({
    record,
    options,
    request,
    returnPath,
  }: {
    options?: ApprovalActionOptions;
    record?: ApprovalRecord | null;
    request?: CatalogOrderRequestApi | null;
    returnPath?: string;
  }) => {
    const employeeId = request?.employee_id ?? record?.employeeId;
    const employeeDetail =
      companyId && employeeId
        ? (
            await getEmployeeDetail({
              companyId,
              employeeId,
            }).unwrap()
          )?.data
        : null;
    const employees = approvalRequestToAssignedEmployees({
      employee: employeeDetail,
      options,
      record,
      request,
    });
    if (!employees.length) return false;

    dispatch(setSelectedEmployees(employees));
    router.push(
      approvalOrderSummaryPath({
        catalogId: request?.catalog_id ?? record?.catalogId,
        options,
        orderRequestId: request?.id ?? record?.id,
        returnPath,
      }),
    );
    return true;
  };
}
