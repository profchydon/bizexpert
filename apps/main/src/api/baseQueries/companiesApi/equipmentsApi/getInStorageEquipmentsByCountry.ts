import { IEquipmentsInStorageByCountry } from "@/types/equipments";
import { companiesApi } from "..";

const getInStorageEquipmentsByCountry = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getInStorageEquipmentsByCountry: query.query<
      ServerPaginatedResponse<IEquipmentsInStorageByCountry[]>,
      {
        companyId: string;
        countryId: string;
        params?: { page?: number };
      }
    >({
      query: ({ companyId, countryId, params }) => ({
        url: `/${companyId}/equipments/in-storage/${countryId}`,
        params: { ...params },
      }),
      providesTags: ["Equipment"],
    }),
  }),
});

export const { useGetInStorageEquipmentsByCountryQuery } =
  getInStorageEquipmentsByCountry;
