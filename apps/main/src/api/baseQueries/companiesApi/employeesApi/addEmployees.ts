import { AddEmployeeRequest } from "@/types/employees";
import { companiesApi } from "..";

export const addEmployees = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    addEmployees: build.mutation<ServerResponse<any>, AddEmployeeRequest>({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/employees`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const { useAddEmployeesMutation } = addEmployees;
