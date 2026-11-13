// import { GetEquipmentResaleValueResponse } from "@/types/offboarding";
import { companiesApi } from "../companiesApi";

export const getEquipmentResaleValue = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getEquipmentResaleValue: build.mutation<
      ServerResponse<any>,
      { equipment_ids: string[]; companyId?: string }
    >({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/offboard/equipments/sale-value`,
        method: "POST",
        data: { ...payload },
      }),
      invalidatesTags: [],
    }),
  }),
});

export const { useGetEquipmentResaleValueMutation } = getEquipmentResaleValue;
