import { UpdateEquipmentAssigneeRequest } from "@/types/equipments";
import { companiesApi } from "..";

export const unAndReAssignEquipmentAssignee = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    unAndReAssignEquipmentAssignee: build.mutation<
      ServerResponse<any>,
      UpdateEquipmentAssigneeRequest
    >({
      query: ({ companyId, equipment_id, payload }) => ({
        url: `/${companyId}/equipments/${equipment_id}/assignee`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
});

export const { useUnAndReAssignEquipmentAssigneeMutation } =
  unAndReAssignEquipmentAssignee;
