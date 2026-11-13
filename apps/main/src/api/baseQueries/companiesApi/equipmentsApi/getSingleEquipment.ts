import { GetEquipmentResponse } from "@/types/equipments";
import { companiesApi } from "..";

const getSingleEquipment = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getSingleEquipment: query.query<
      GetEquipmentResponse,
      { companyId: string; equipmentId: string }
    >({
      query: ({ companyId, equipmentId }) => ({
        url: `/${companyId}/equipments/${equipmentId}`,
      }),
      providesTags: ["Equipment"],
    }),
  }),
});

export const { useGetSingleEquipmentQuery, useLazyGetSingleEquipmentQuery } =
  getSingleEquipment;
