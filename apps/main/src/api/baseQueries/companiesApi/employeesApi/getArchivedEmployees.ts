import { companiesApi } from "..";
import { IEmployees } from "@/types/employees";
import {
  EmployeeListPayload,
  normalizeEmployeeListResponse,
  resolveEmployeePaginateParam,
} from "./normalizeEmployeeListResponse";

const getArchivedEmployees = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getArchivedEmployees: query.query<
      ServerResponse<EmployeeListPayload>,
      {
        companyId: string;
        params?: {
          search?: string | null;
          page?: number;
          paginate?: boolean;
          subsidiary_id?: string;
        };
      }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/employees/archived`,
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

export const { useGetArchivedEmployeesQuery } = getArchivedEmployees;
