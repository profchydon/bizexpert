import { AddEmployeeRequest } from "@/types/employees";
import { companiesApi } from "../..";

export const addMultipleEmployeeAsAdmin = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    addMultipleEmployeeAsAdmin: build.mutation<
      ServerResponse<any>,
      { employeeIds: string[]; companyId?: string }
    >({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/settings/users`,
        method: "PUT",
        data: { ...payload },
      }),
      invalidatesTags: ["Admins"],
    }),
  }),
});

export const { useAddMultipleEmployeeAsAdminMutation } =
  addMultipleEmployeeAsAdmin;
