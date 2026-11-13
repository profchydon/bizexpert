import { companiesApi } from "..";
import type { OfficeAssignmentResult } from "@/types/offices";
import { officeAssignmentTags } from "./officeAssignmentTags";

const assignOfficeMembers = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    assignOfficeEmployees: build.mutation<
      ServerResponse<OfficeAssignmentResult>,
      {
        companyId: string;
        officeId: string;
        sourceOfficeId?: string;
        payload: { user_ids: string[] };
      }
    >({
      query: ({ companyId, officeId, payload }) => ({
        url: `/${companyId}/offices/${officeId}/employees`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (result, error, { officeId, sourceOfficeId }) =>
        officeAssignmentTags("Employees", officeId, sourceOfficeId),
    }),
    assignOfficeEquipments: build.mutation<
      ServerResponse<OfficeAssignmentResult>,
      {
        companyId: string;
        officeId: string;
        sourceOfficeId?: string;
        payload: { equipment_ids: string[]; office_area_id?: string | null };
      }
    >({
      query: ({ companyId, officeId, payload }) => ({
        url: `/${companyId}/offices/${officeId}/equipments`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (result, error, { officeId, sourceOfficeId }) =>
        officeAssignmentTags("Equipment", officeId, sourceOfficeId),
    }),
  }),
});

export const {
  useAssignOfficeEmployeesMutation,
  useAssignOfficeEquipmentsMutation,
} = assignOfficeMembers;
