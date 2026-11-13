import type { IInStorageEquipmentDetail } from "@/types/equipmentsInStorageInventory";
import { companiesApi } from "..";

const getInStorageEquipmentDetail = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getInStorageEquipmentDetail: query.query<
      ServerResponse<IInStorageEquipmentDetail>,
      { companyId: string; equipmentId: string }
    >({
      query: ({ companyId, equipmentId }) => ({
        url: `/${companyId}/equipments/${equipmentId}/storage`,
      }),
      providesTags: (_result, _error, { equipmentId }) => [
        { type: "Equipment", id: equipmentId },
      ],
    }),
  }),
});

export const { useGetInStorageEquipmentDetailQuery } =
  getInStorageEquipmentDetail;
