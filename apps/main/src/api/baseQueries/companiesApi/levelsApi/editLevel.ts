import { companiesApi } from "..";

export const editLevel = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    editLevel: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        levelId: string;
        members?: string[];
        name: string;
      }
    >({
      query: ({ companyId, levelId, ...rest }) => ({
        url: `/${companyId}/levels/${levelId}`,
        method: "PUT",
        data: { ...rest },
      }),
      invalidatesTags: ["Levels"],
    }),
  }),
});

export const { useEditLevelMutation } = editLevel;
