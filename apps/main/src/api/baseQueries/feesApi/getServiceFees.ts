import config from "@/config/config";
import { feesApi } from ".";

export type ServiceFeeStorageByType = Record<string, number>;

export type ServiceFeeStorage = number | ServiceFeeStorageByType;

export interface ServiceFeeResponse {
  Reassignment: number;
  Storage: ServiceFeeStorage;
  Dispose: number;
  Factory_Reset: number;
  Device_Check: number;
  Resale?: number;
}

export const getServiceFees = feesApi.injectEndpoints({
  endpoints: (query) => ({
    getServiceFees: query.query<ServerResponse<ServiceFeeResponse>, void>({
      query: () => ({
        url: `${config.API_URL}/fees/service-fees`,
        method: "GET",
      }),
      providesTags: ["Fees"],
    }),
  }),
});

export const { useGetServiceFeesQuery, useLazyGetServiceFeesQuery } =
  getServiceFees;
