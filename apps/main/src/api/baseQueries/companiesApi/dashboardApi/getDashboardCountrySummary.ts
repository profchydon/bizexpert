// import { IDashboardSummary } from "@/types/dashboard";
import { IDashboardCountrySummary } from "@/types/dashboard";
import { companiesApi } from "..";

const getDashboardCountrySummary = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getDashboardCountrySummary: query.query<
      ServerResponse<IDashboardCountrySummary[]>,
      { companyId?: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/country-summary`,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardCountrySummaryQuery,
  useLazyGetDashboardCountrySummaryQuery,
} = getDashboardCountrySummary;
