import type {
  IInStorageInventoryItem,
  IInStorageInventoryParams,
} from "@/types/equipmentsInStorageInventory";
import { companiesApi } from "..";

const getInStorageInventory = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getInStorageInventory: query.query<
      ServerPaginatedResponse<IInStorageInventoryItem[]>,
      { companyId: string; params?: IInStorageInventoryParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/equipments/in-storage`,
        params,
      }),
      providesTags: ["Equipment"],
    }),
  }),
});

export const { useGetInStorageInventoryQuery } = getInStorageInventory;
