import { companiesApi } from "..";

export type ResolveScriptApprovalItem = {
  ticket_id: string;
  ticket_number: string | null;
  generated_script_id: string;
  employee_id: string | null;
  problem_summary: string | null;
  purpose: string | null;
  expected_outcome: string | null;
  created_at: string;
};

const resolveScriptApprovalsApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getResolveScriptApprovals: build.query<
      ServerResponse<{ items: ResolveScriptApprovalItem[] }>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/resolve/script-approvals`,
      }),
      providesTags: ["ResolveScriptApprovals"],
    }),
    decideResolveScriptApproval: build.mutation<
      ServerResponse<{ ticket_id: string; approved: boolean }>,
      { companyId: string; ticketId: string; approved: boolean }
    >({
      query: ({ companyId, ticketId, approved }) => ({
        url: `/${companyId}/resolve/script-approvals/${ticketId}`,
        method: "POST",
        data: { approved },
      }),
      invalidatesTags: ["ResolveScriptApprovals"],
    }),
  }),
});

export const {
  useGetResolveScriptApprovalsQuery,
  useDecideResolveScriptApprovalMutation,
} = resolveScriptApprovalsApi;
