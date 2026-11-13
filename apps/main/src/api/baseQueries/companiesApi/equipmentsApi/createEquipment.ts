import { CreateEquipmentRequest } from "@/types/equipments";
import { companiesApi } from "..";

export const createEquipment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createEquipment: build.mutation<
      ServerResponse<any>,
      CreateEquipmentRequest
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/equipments`,
        method: "POST",
        data: payload,
        params: { excludePathFromEncryption: true },
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
});

export const { useCreateEquipmentMutation } = createEquipment;
