import { IDepartment, ILevel } from "@/types/departments";
import { companiesApi } from "..";

const getLevel = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getLevel: query.query<
      ServerResponse<ILevel>,
      { companyId: string; levelId: string }
    >({
      query: ({ companyId, levelId }) => ({
        url: `/${companyId}/levels/${levelId}`,
      }),
      providesTags: ["Levels"],
    }),
  }),
});

export const { useGetLevelQuery } = getLevel;
