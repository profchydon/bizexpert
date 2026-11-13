import type {
  IInStorageOrdersListData,
  IInStorageOrdersParams,
} from "@/types/storageOrdersApi";
import { companiesApi } from "..";

const getInStorageOrders = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getInStorageOrders: query.query<
      ServerResponse<IInStorageOrdersListData>,
      { companyId: string; params?: IInStorageOrdersParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/equipments/in-storage/orders`,
        params,
      }),
      providesTags: ["Equipment"],
    }),
  }),
});

export const { useGetInStorageOrdersQuery, useLazyGetInStorageOrdersQuery } =
  getInStorageOrders;
