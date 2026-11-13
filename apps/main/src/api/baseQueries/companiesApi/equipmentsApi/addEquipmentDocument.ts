import { AddEquipmentDocumentRequest } from "@/types/equipments";
import { companiesApi } from "..";

export const addEquipmentDocument = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    addEquipmentDocument: build.mutation<
      ServerResponse<any>,
      AddEquipmentDocumentRequest
    >({
      query: ({ companyId, equipmentId, payload }) => ({
        url: `/${companyId}/equipments/${equipmentId}/documents`,
        method: "POST",
        data: payload,
        params: { excludePathFromEncryption: true },
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
});

export const { useAddEquipmentDocumentMutation } = addEquipmentDocument;
