import type { FleetTelemetryPayload } from "@/types/telemetry";
import { companiesApi } from "..";

export type FleetTelemetryQueryParams = {
  subsidiary_id?: string;
  office_id?: string;
};

const getFleetTelemetry = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getFleetTelemetry: query.query<
      ServerResponse<FleetTelemetryPayload>,
      { companyId: string; params?: FleetTelemetryQueryParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/telemetry/fleet`,
        params,
      }),
      providesTags: ["Telemetry"],
    }),
  }),
});

export const { useGetFleetTelemetryQuery, useLazyGetFleetTelemetryQuery } =
  getFleetTelemetry;
