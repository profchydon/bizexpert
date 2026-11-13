import { AddBulkEmployeeRequest } from "@/types/employees";
import { companiesApi } from "..";

export const addBulkEmployees = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    addBulkEmployees: build.mutation<
      ServerResponse<any>,
      AddBulkEmployeeRequest
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/employees/bulk`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const { useAddBulkEmployeesMutation } = addBulkEmployees;
