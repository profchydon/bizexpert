"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useUpdateJoinRequestAutoApprovalMutation } from "@/api/baseQueries/companiesApi/settingsApi/usersApi/updateJoinRequestAutoApproval";
import { useGetUserProfileQuery } from "@/api/baseQueries/userApi/getUserProfile";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";

export function JoinRequestAutoApprovalCard() {
  const {
    data: profileInfoRes,
    isLoading: isCompanyLoading,
    refetch,
  } = useGetUserProfileQuery();
  const company = profileInfoRes?.data?.company;
  const [autoApproveRequests, setAutoApproveRequests] = useState(
    Boolean(company?.auto_approve_join_requests),
  );
  const [updateJoinRequestAutoApproval, updateAutoApprovalProps] =
    useUpdateJoinRequestAutoApprovalMutation();

  useEffect(() => {
    setAutoApproveRequests(Boolean(company?.auto_approve_join_requests));
  }, [company?.auto_approve_join_requests]);

  async function handleToggleAutoApprove(checked: boolean) {
    if (!company?.id || updateAutoApprovalProps.isLoading) {
      return;
    }

    const previousValue = autoApproveRequests;
    setAutoApproveRequests(checked);

    try {
      const { success, message } = await updateJoinRequestAutoApproval({
        companyId: company.id,
        auto_approve_join_requests: checked,
      }).unwrap();

      if (success) {
        displaySuccessMessage(
          message ||
            `Auto-approve requests ${checked ? "enabled" : "disabled"} successfully`,
        );
        refetch();
      }
    } catch {
      setAutoApproveRequests(previousValue);
      displayErrorMessage("Unable to update auto-approve setting.");
    }
  }

  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex shrink-0 flex-col gap-1 lg:w-[280px]">
        <h2 className="text-sm font-semibold text-gray-900">Join requests</h2>
        <p className="text-sm text-gray-600">
          Control whether employees who request access to your workspace are
          approved automatically.
        </p>
      </div>

      <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-start gap-3 p-6">
          <Switch
            checked={autoApproveRequests}
            disabled={
              !company?.id ||
              updateAutoApprovalProps.isLoading ||
              isCompanyLoading
            }
            onCheckedChange={handleToggleAutoApprove}
            className="mt-0.5 h-5 w-9 data-[state=checked]:bg-primary-600 data-[state=unchecked]:bg-gray-200"
          />

          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-900">
              Auto-approve requests
            </p>
            <p className="text-sm text-gray-600">
              Anyone who requests to join your company will be automatically
              approved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
