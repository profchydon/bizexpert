import { IDepartment } from "@/types/departments";
import { companiesApi } from "..";

const getDepartment = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getDepartment: query.query<
      ServerResponse<IDepartment>,
      { companyId: string; departmentId: string }
    >({
      query: ({ companyId, departmentId }) => ({
        url: `/${companyId}/departments/${departmentId}`,
      }),
      providesTags: ["Department"],
    }),
  }),
});

export const { useGetDepartmentQuery } = getDepartment;
