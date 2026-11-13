import type { FleetSummaryPayload } from "@/types/telemetry";
import { companiesApi } from "..";
import type { FleetTelemetryQueryParams } from "./getFleetTelemetry";

const getTelemetrySummary = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getTelemetrySummary: query.query<
      ServerResponse<FleetSummaryPayload>,
      { companyId: string; params?: FleetTelemetryQueryParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/telemetry/summary`,
        params,
      }),
      providesTags: ["Telemetry"],
    }),
  }),
});

export const { useGetTelemetrySummaryQuery, useLazyGetTelemetrySummaryQuery } =
  getTelemetrySummary;
