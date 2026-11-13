import { EditEquipmentRequest } from "@/types/equipments";
import { companiesApi } from "..";

export const editEquipment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    editEquipment: build.mutation<ServerResponse<any>, EditEquipmentRequest>({
      query: ({ companyId, equipment_id, payload }) => ({
        url: `/${companyId}/equipments/${equipment_id}/update`,
        method: "POST",
        data: payload,
        params: { excludePathFromEncryption: true },
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
});

export const { useEditEquipmentMutation } = editEquipment;
