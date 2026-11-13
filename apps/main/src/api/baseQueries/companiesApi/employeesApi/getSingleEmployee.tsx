import { companiesApi } from "..";
import { GetEmployeesResponse } from "@/types/employees";

const getSingleEmployee = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getSingleEmployee: query.query<
      GetEmployeesResponse,
      { companyId: string; employeeId: string }
    >({
      query: ({ companyId, employeeId }) => ({
        url: `/${companyId}/employees/${employeeId}`,
      }),
      providesTags: ["SingleEmployees"],
    }),
  }),
});

export const { useGetSingleEmployeeQuery, useLazyGetSingleEmployeeQuery } =
  getSingleEmployee;
