import { companiesApi } from "..";

export const deleteLevel = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deleteLevel: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        levelId: string;
      }
    >({
      query: ({ companyId, levelId }) => ({
        url: `/${companyId}/levels/${levelId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Levels"],
    }),
  }),
});

export const { useDeleteLevelMutation } = deleteLevel;
