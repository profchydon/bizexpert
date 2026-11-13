import type { TelemetryDevice } from "@/types/telemetry";
import { companiesApi } from "..";

const getTelemetryDevice = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getTelemetryDevice: query.query<
      ServerResponse<TelemetryDevice>,
      { companyId: string; deviceId: string }
    >({
      query: ({ companyId, deviceId }) => ({
        url: `/${companyId}/telemetry/devices/${deviceId}`,
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Telemetry", id: arg.deviceId },
      ],
    }),
  }),
});

export const { useGetTelemetryDeviceQuery, useLazyGetTelemetryDeviceQuery } =
  getTelemetryDevice;
