import { companiesApi } from "..";

const getJobTitles = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getJobTitles: build.query<ServerResponse<string[]>, { companyId: string }>({
      query: ({ companyId }) => ({
        url: `/${companyId}/job-titles`,
      }),
    }),
  }),
});

export const { useGetJobTitlesQuery } = getJobTitles;
