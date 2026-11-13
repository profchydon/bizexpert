import { IEmployees } from "@/types/employees";
import { companiesApi } from "..";

const getEmployeeDashboard = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getEmployeeDashboard: query.query<
      ServerResponse<IEmployees>,
      { companyId: string; employeeId: string }
    >({
      query: ({ companyId, employeeId }) => ({
        url: `/${companyId}/employees/${employeeId}/dashboard`,
      }),
      providesTags: ["SingleEmployees"],
    }),
  }),
});

export const { useGetEmployeeDashboardQuery } = getEmployeeDashboard;
