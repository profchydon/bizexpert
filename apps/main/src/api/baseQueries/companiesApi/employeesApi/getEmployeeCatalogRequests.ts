import { IEmployeeRequest } from "@/types/employees";
import { companiesApi } from "..";

export const getEmployeeCatalogRequests = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getEmployeeCatalogRequests: build.query<
      ServerResponse<{ requests: IEmployeeRequest[] }>,
      {
        companyId: string;
        employeeId: string;
      }
    >({
      query: ({ companyId, employeeId, ...rest }) => ({
        url: `/${companyId}/employees/${employeeId}/request`,
      }),
      providesTags: ["Employees"],
    }),
  }),
});

export const { useGetEmployeeCatalogRequestsQuery } =
  getEmployeeCatalogRequests;
