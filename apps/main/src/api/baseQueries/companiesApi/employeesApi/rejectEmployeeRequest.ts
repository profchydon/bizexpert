import { companiesApi } from "..";

export const rejectEmployeeRequest = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    rejectEmployeeRequest: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        reqId: string;
        reason: string;
      }
    >({
      query: ({ companyId, reqId, reason }) => ({
        url: `/${companyId}/employees/request/${reqId}/reject`,
        method: "PUT",
        data: { reason },
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const { useRejectEmployeeRequestMutation } = rejectEmployeeRequest;
