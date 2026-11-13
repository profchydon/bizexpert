import { companiesApi } from "..";
import { IEmployees } from "@/types/employees";

const getCompanyUsers = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getCompanyUsers: query.query<
      ServerPaginatedResponse<IEmployees[]>,
      { companyId: string; params?: { search?: string | null; page?: number } }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/users`,
        params,
      }),
      providesTags: ["Employees"],
    }),
  }),
});

export const { useGetCompanyUsersQuery, useLazyGetCompanyUsersQuery } =
  getCompanyUsers;
