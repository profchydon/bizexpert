import type { IInStorageInventorySummary } from "@/types/equipmentsInStorageInventory";
import { companiesApi } from "..";

const getInStorageInventorySummary = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getInStorageInventorySummary: query.query<
      ServerResponse<IInStorageInventorySummary>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/equipments/in-storage/summary`,
      }),
      providesTags: ["Equipment"],
    }),
  }),
});

export const { useGetInStorageInventorySummaryQuery } =
  getInStorageInventorySummary;
