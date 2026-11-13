import { IDepartment } from "@/types/departments";
import { companiesApi } from "..";

const getDepartments = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getDepartments: query.query<
      ServerResponse<{ data: IDepartment[] }>,
      {
        companyId: string;
        params?: { search?: string | null; page?: number; paginate?: boolean };
      }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/departments`,
        params: {
          ...params,
          paginate: params?.paginate === false ? undefined : true,
        },
      }),
      providesTags: ["Department"],
    }),
  }),
});

export const { useGetDepartmentsQuery, useLazyGetDepartmentsQuery } =
  getDepartments;
