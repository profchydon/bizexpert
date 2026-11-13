import { companiesApi } from "..";
import { IEmployees } from "@/types/employees";
import {
  EmployeeListPayload,
  normalizeEmployeeListResponse,
  resolveEmployeePaginateParam,
} from "./normalizeEmployeeListResponse";

type EmployeeListQueryParams = {
  search?: string | null;
  page?: number;
  per_page?: number;
  paginate?: boolean;
  country_id?: string;
  country_code?: string;
  office_id?: string;
};

const getEmployees = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getEmployees: query.query<
      ServerResponse<EmployeeListPayload>,
      {
        companyId: string;
        params?: EmployeeListQueryParams;
      }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/employees`,
        params: {
          ...params,
          paginate: resolveEmployeePaginateParam(params?.paginate),
        },
      }),
      transformResponse: normalizeEmployeeListResponse,
      providesTags: ["Employees"],
    }),
  }),
});

export const { useGetEmployeesQuery, useLazyGetEmployeesQuery } = getEmployees;
