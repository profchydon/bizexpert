import { DeleteEquipmentDocumentRequest } from "@/types/equipments";
import { companiesApi } from "..";

export const deleteEquipmentDocument = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deleteEquipmentDocument: build.mutation<
      ServerResponse<any>,
      DeleteEquipmentDocumentRequest
    >({
      query: ({ companyId, equipmentId, documentId }) => ({
        url: `/${companyId}/equipments/${equipmentId}/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
});

export const { useDeleteEquipmentDocumentMutation } = deleteEquipmentDocument;
