import { CreateEquipmentRequest } from "@/types/equipments";
import { companiesApi } from "..";

export const createBulkEquipments = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createBulkEquipments: build.mutation<
      ServerResponse<any>,
      CreateEquipmentRequest
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/equipments/bulk`,
        method: "POST",
        data: payload,
        params: { excludePathFromEncryption: true },
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
});

export const { useCreateBulkEquipmentsMutation } = createBulkEquipments;
