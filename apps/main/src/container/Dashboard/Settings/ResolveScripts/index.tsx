"use client";

import { Button } from "@/components/ui/button";
import PageState from "@/components/PageState";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import {
  useDecideResolveScriptApprovalMutation,
  useGetResolveScriptApprovalsQuery,
} from "@/api/baseQueries/companiesApi/settingsApi/resolveScriptApprovalsApi";
import { resolveScriptApprovalCopy } from "./resolveScriptApprovalCopy";
import { cn } from "@/lib/utils";

const ResolveScripts = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = company?.id || "";
  const { data, isLoading, isError } = useGetResolveScriptApprovalsQuery(
    { companyId },
    { skip: !companyId },
  );
  const [decide, { isLoading: isDeciding }] =
    useDecideResolveScriptApprovalMutation();
  const items = data?.data?.items ?? [];
  const copy = resolveScriptApprovalCopy(items.length);

  const onDecide = async (ticketId: string, approved: boolean) => {
    await decide({ companyId, ticketId, approved }).unwrap();
    displaySuccessMessage(
      approved ? "Script approved" : "Script rejected",
      "The employee will see the decision in Rayda.",
    );
  };

  return (
    <PageState
      isLoading={isLoading}
      isError={isError}
      errorMessage="Could not load these requests."
    >
      <div className="rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {copy.title}
            </h2>
            <p className="text-sm text-gray-600">{copy.description}</p>
          </div>

          {items.length > 0 && (
            <div className="mt-2 flex flex-col">
              {items.map((item, index) => (
                <div
                  key={item.generated_script_id}
                  className={cn(
                    "flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between",
                    index !== items.length - 1
                      ? "border-b border-gray-200"
                      : "",
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.ticket_number ?? "Resolve ticket"} ·{" "}
                      {item.purpose ?? "script"}
                    </p>
                    {item.problem_summary ? (
                      <p className="text-sm text-gray-600">
                        {item.problem_summary}
                      </p>
                    ) : null}
                    {item.expected_outcome ? (
                      <p className="mt-1 text-xs font-medium text-gray-500">
                        Expected: {item.expected_outcome}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isDeciding}
                      onClick={() => {
                        void onDecide(item.ticket_id, false);
                      }}
                      data-testid="resolvescripts-button"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      disabled={isDeciding}
                      onClick={() => {
                        void onDecide(item.ticket_id, true);
                      }}
                      data-testid="resolvescripts-button-2"
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageState>
  );
};

export default ResolveScripts;
