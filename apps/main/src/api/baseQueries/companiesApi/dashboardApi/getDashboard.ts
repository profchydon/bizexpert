import { IDashboard } from "@/types/dashboard";
import { companiesApi } from "..";

const getDashboard = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getDashboard: query.query<
      ServerResponse<IDashboard>,
      { companyId?: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/dashboard`,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = getDashboard;
