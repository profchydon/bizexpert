"use client";

import { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import displayErrorMessage from "@/utils/displayErrorMessage";
import JoinRequestModal, { JoinRequestItem } from "./JoinRequestModal";
import { useGetJoinRequestsQuery } from "@/api/baseQueries/companiesApi/dashboardApi/getJoinRequests";
import { useUpdateJoinRequestStatusMutation } from "@/api/baseQueries/companiesApi/dashboardApi/updateJoinRequestStatus";

type JoinRequestResponseItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
};

const initialsAvatarClassName = "bg-white border border-gray-200";

const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";
  return `${first}${last}`.toUpperCase();
};

const JoinRequestBanner = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const { data: joinRequestsResponse, refetch } = useGetJoinRequestsQuery(
    { companyId: company?.id },
    { skip: !company?.id },
  );
  const [updateJoinRequestStatus] = useUpdateJoinRequestStatusMutation();

  const pendingRequests = useMemo(() => {
    const data = Array.isArray(joinRequestsResponse?.data)
      ? (joinRequestsResponse.data as JoinRequestResponseItem[])
      : [];

    return data.filter(
      (request) => request?.status?.toLowerCase() === "pending",
    );
  }, [joinRequestsResponse]);

  const mappedRequests = useMemo<JoinRequestItem[]>(
    () =>
      pendingRequests.map((request) => ({
        id: request.id,
        name: `${request.first_name} ${request.last_name}`.trim(),
        email: request.email,
        initials: getInitials(request.first_name, request.last_name),
        avatarClassName: initialsAvatarClassName,
      })),
    [pendingRequests],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const requestCount = mappedRequests.length;
  const companyName = company?.name || "your company";
  const hasJoinRequests = pendingRequests.length > 0;

  useEffect(() => {
    setSelectedIds(mappedRequests.map((request) => request.id));
  }, [mappedRequests]);

  const description = useMemo(() => {
    const requestLabel = requestCount === 1 ? "request has" : "requests have";

    return `(${requestCount}) ${requestLabel} been sent to ${companyName}, please approve or decline`;
  }, [companyName, requestCount]);

  const updateRequestsStatus = async (
    requestIds: string[],
    isApproved: boolean,
  ) => {
    if (!company?.id || !requestIds.length) {
      return { successCount: 0 };
    }

    try {
      await updateJoinRequestStatus({
        companyId: company.id,
        is_approved: isApproved,
        join_request_ids: requestIds,
      }).unwrap();

      return { successCount: requestIds.length };
    } catch {
      return { successCount: 0 };
    }
  };

  const submitRequestUpdates = async (
    requestIds: string[],
    isApproved: boolean,
  ) => {
    if (!company?.id) {
      displayErrorMessage("Unable to update join requests right now.");
      return;
    }

    if (!requestIds.length) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { successCount } = await updateRequestsStatus(
        requestIds,
        isApproved,
      );

      if (successCount > 0) {
        displaySuccessMessage(
          `${successCount} request${successCount > 1 ? "s" : ""} ${
            isApproved ? "approved" : "rejected"
          } successfully`,
        );
        await refetch();
      }

      if (successCount < requestIds.length) {
        displayErrorMessage(
          `Some requests could not be ${
            isApproved ? "approved" : "rejected"
          }. Please try again.`,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    await submitRequestUpdates(selectedIds, true);
  };

  const handleRejectRequests = async () => {
    await submitRequestUpdates(selectedIds, false);
  };

  const handleToggleRequest = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  if (!hasJoinRequests) {
    return null;
  }

  return (
    <>
      <div className="rounded-xl border border-warning-400 bg-warning-50">
        <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-100">
              <div className="absolute inset-[-5px] rounded-full border-2 border-warning-600/30" />
              <div className="absolute inset-[-10px] rounded-full border-2 border-warning-600/10" />
              <Users className="relative z-10 h-5 w-5 text-warning-700" />
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5">
              <span className="font-semibold text-gray-700">
                Request to join
              </span>
              <span className="text-gray-600">{description}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-10 shrink-0 rounded-lg border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm"
            onClick={() => {
              setSelectedIds(mappedRequests.map((request) => request.id));
              setIsModalOpen(true);
            }}
            data-testid="joinrequestbanner-button"
          >
            View request
          </Button>
        </div>
      </div>

      <JoinRequestModal
        open={isModalOpen}
        requests={mappedRequests}
        selectedIds={selectedIds}
        isLoading={isSubmitting}
        onApprove={handleApprove}
        onReject={handleRejectRequests}
        onToggleRequest={handleToggleRequest}
        onOpenChange={(open) => {
          if (isSubmitting) {
            return;
          }

          setIsModalOpen(open);
        }}
      />
    </>
  );
};

export default JoinRequestBanner;
