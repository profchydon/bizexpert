import { IEmployeeRequest } from "@/types/employees";
import { companiesApi } from "..";

export const getAdminCatalogRequests = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminCatalogRequests: build.query<
      ServerResponse<{ requests: IEmployeeRequest[] }>,
      {
        companyId: string;
        catalogId: string;
        params?: { search?: string | null };
      }
    >({
      query: ({ companyId, catalogId, ...rest }) => ({
        url: `/${companyId}/employees/request/${catalogId}`,
      }),
      providesTags: ["Employees"],
    }),
  }),
});

export const { useGetAdminCatalogRequestsQuery } = getAdminCatalogRequests;
