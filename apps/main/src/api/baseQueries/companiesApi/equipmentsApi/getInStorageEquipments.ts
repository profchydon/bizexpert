import { IItemsInStorage } from "@/types/equipments";
import { companiesApi } from "..";

const getInStorageEquipments = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getInStorageEquipments: query.query<
      ServerResponse<IItemsInStorage>,
      {
        companyId: string;
      }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/equipments/in-storage/dashboard`,
      }),
      providesTags: ["Equipment"],
    }),
  }),
});

export const { useGetInStorageEquipmentsQuery } = getInStorageEquipments;
