import { companiesApi } from "..";
import type { ServerOfficeArea } from "@/types/offices";

const officeAreas = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createOfficeArea: build.mutation<
      ServerResponse<ServerOfficeArea>,
      { companyId: string; officeId: string; payload: { name: string } }
    >({
      query: ({ companyId, officeId, payload }) => ({
        url: `/${companyId}/offices/${officeId}/areas`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (result, error, { officeId }) => [
        { type: "Office", id: officeId },
      ],
    }),
    updateOfficeArea: build.mutation<
      ServerResponse<ServerOfficeArea>,
      {
        companyId: string;
        officeId: string;
        areaId: string;
        payload: { name: string };
      }
    >({
      query: ({ companyId, officeId, areaId, payload }) => ({
        url: `/${companyId}/offices/${officeId}/areas/${areaId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (result, error, { officeId }) => [
        { type: "Office", id: officeId },
        "Equipment",
      ],
    }),
    deleteOfficeArea: build.mutation<
      ServerResponse<unknown>,
      { companyId: string; officeId: string; areaId: string }
    >({
      query: ({ companyId, officeId, areaId }) => ({
        url: `/${companyId}/offices/${officeId}/areas/${areaId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { officeId }) => [
        { type: "Office", id: officeId },
        "Offices",
        "Equipment",
      ],
    }),
  }),
});

export const {
  useCreateOfficeAreaMutation,
  useUpdateOfficeAreaMutation,
  useDeleteOfficeAreaMutation,
} = officeAreas;
