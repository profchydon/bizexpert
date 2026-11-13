import { AddEmployeeRequest } from "@/types/employees";
import { companiesApi } from "../..";

export const addEmployeeAsAdmin = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    addEmployeeAsAdmin: build.mutation<ServerResponse<any>, AddEmployeeRequest>(
      {
        query: ({ companyId, payload }) => ({
          url: `/${companyId}/settings/users`,
          method: "POST",
          data: payload,
        }),
        invalidatesTags: ["Admins"],
      },
    ),
  }),
});

export const { useAddEmployeeAsAdminMutation } = addEmployeeAsAdmin;
