import { AddEmployeeRequest, EditEmployeeRequest } from "@/types/employees";
import { companiesApi } from "..";

export const editEmployee = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    editEmployee: build.mutation<ServerResponse<any>, EditEmployeeRequest>({
      query: ({ companyId, employeeId, payload }) => ({
        url: `/${companyId}/employees/${employeeId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Employees", "SingleEmployees"],
    }),
  }),
});

export const { useEditEmployeeMutation } = editEmployee;
