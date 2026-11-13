import { AddEquipmentNoteRequest } from "@/types/equipments";
import { companiesApi } from "..";

export const addEquipmentNote = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    addEquipmentNote: build.mutation<
      ServerResponse<any>,
      AddEquipmentNoteRequest
    >({
      query: ({ companyId, equipmentId, payload }) => ({
        url: `/${companyId}/equipments/${equipmentId}/note`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
});

export const { useAddEquipmentNoteMutation } = addEquipmentNote;
