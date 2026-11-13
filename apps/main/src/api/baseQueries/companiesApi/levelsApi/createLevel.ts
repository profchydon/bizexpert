import { companiesApi } from "..";

export const createLevel = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createLevel: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        name: string;
        members: string[];
      }
    >({
      query: ({ companyId, ...rest }) => ({
        url: `/${companyId}/levels`,
        method: "POST",
        data: { ...rest },
      }),
      invalidatesTags: ["Levels"],
    }),
  }),
});

export const { useCreateLevelMutation } = createLevel;
