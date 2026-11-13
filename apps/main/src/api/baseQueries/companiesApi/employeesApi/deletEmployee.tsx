import { DeleteEmployeeRequest } from "@/types/employees";
import { companiesApi } from "..";

export const deleteEmployee = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deleteEmployee: build.mutation<ServerResponse<any>, DeleteEmployeeRequest>({
      query: ({ companyId, employeeId }) => ({
        url: `/${companyId}/employees/${employeeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const { useDeleteEmployeeMutation } = deleteEmployee;
