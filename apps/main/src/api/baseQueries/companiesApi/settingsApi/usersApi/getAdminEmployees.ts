import { IEmployees } from "@/types/employees";
import { companiesApi } from "../..";

export const getAdminEmployees = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminEmployees: build.query<
      ServerPaginatedResponse<IEmployees[]>,
      { companyId?: string; params?: { search?: string | null } }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/settings/users`,
        params,
      }),
      providesTags: ["Admins"],
    }),
  }),
});

export const { useGetAdminEmployeesQuery } = getAdminEmployees;
