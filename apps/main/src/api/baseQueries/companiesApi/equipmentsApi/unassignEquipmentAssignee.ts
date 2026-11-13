import { companiesApi } from "..";

export const unassignEquipmentAssignee = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    unassignEquipmentAssignee: build.mutation<
      ServerResponse<any>,
      { companyId: string; equipment_id: string }
    >({
      query: ({ companyId, equipment_id }) => ({
        url: `/${companyId}/equipments/${equipment_id}/unassign`,
        method: "PUT",
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
});

export const { useUnassignEquipmentAssigneeMutation } =
  unassignEquipmentAssignee;
