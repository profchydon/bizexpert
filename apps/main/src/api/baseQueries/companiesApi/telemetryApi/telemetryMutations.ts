import { companiesApi } from "..";
import type { Ownership } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/types";
import type {
  TelemetryDevice,
  TelemetryInstallRequest,
  TelemetryIssueAction,
} from "@/types/telemetry";

export type DiscoveredDevice = {
  id: string;
  hostname: string;
  model: string;
  type: string;
  serial: string;
  os: string;
  employeeName: string;
  employeeAccount: string;
  firstSeenLabel: string;
  lastSyncedLabel: string;
  country: string;
  image: string;
};

const telemetryMutations = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    sendTelemetryInstallRequest: build.mutation<
      ServerResponse<TelemetryInstallRequest>,
      { companyId: string; deviceId: string }
    >({
      query: ({ companyId, deviceId }) => ({
        url: `/${companyId}/telemetry/devices/${deviceId}/install-request`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Telemetry", id: arg.deviceId },
      ],
    }),
    updateTelemetryIssue: build.mutation<
      ServerResponse<TelemetryIssueAction>,
      {
        companyId: string;
        deviceId: string;
        issue: string;
        paused?: boolean;
        ignored?: boolean;
      }
    >({
      query: ({ companyId, deviceId, issue, ...data }) => ({
        url: `/${companyId}/telemetry/devices/${deviceId}/issues/${issue}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Telemetry", id: arg.deviceId },
      ],
    }),
    stopTelemetryCollecting: build.mutation<
      ServerResponse<{ id: string; status: string; stopped_at: string | null }>,
      { companyId: string; deviceId: string }
    >({
      query: ({ companyId, deviceId }) => ({
        url: `/${companyId}/telemetry/devices/${deviceId}/stop`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Telemetry", id: arg.deviceId },
      ],
    }),
    restoreTelemetryCollecting: build.mutation<
      ServerResponse<{ id: string; status: string; stopped_at: string | null }>,
      { companyId: string; deviceId: string }
    >({
      query: ({ companyId, deviceId }) => ({
        url: `/${companyId}/telemetry/devices/${deviceId}/restore`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Telemetry", id: arg.deviceId },
      ],
    }),
    getDiscoveredDevices: build.query<
      ServerResponse<DiscoveredDevice[]>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/telemetry/discovered`,
      }),
      providesTags: [{ type: "Telemetry", id: "DISCOVERED" }],
    }),
    classifyDiscoveredDevice: build.mutation<
      ServerResponse<{ equipment_id: string }>,
      { companyId: string; agentId: string; ownership: Ownership }
    >({
      query: ({ companyId, agentId, ownership }) => ({
        url: `/${companyId}/telemetry/discovered/${agentId}/classify`,
        method: "POST",
        data: { ownership },
      }),
      invalidatesTags: [
        { type: "Telemetry", id: "DISCOVERED" },
        { type: "Telemetry", id: "LIST" },
      ],
    }),
    dismissDiscoveredDevice: build.mutation<
      ServerResponse<unknown>,
      { companyId: string; agentId: string }
    >({
      query: ({ companyId, agentId }) => ({
        url: `/${companyId}/telemetry/discovered/${agentId}/dismiss`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Telemetry", id: "DISCOVERED" }],
    }),
    getAssignedTelemetryDevice: build.query<
      ServerResponse<TelemetryDevice>,
      { companyId: string; deviceId: string }
    >({
      query: ({ companyId, deviceId }) => ({
        url: `/${companyId}/telemetry/assigned/${deviceId}`,
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Telemetry", id: arg.deviceId },
      ],
    }),
  }),
});

export const {
  useSendTelemetryInstallRequestMutation,
  useUpdateTelemetryIssueMutation,
  useStopTelemetryCollectingMutation,
  useRestoreTelemetryCollectingMutation,
  useGetDiscoveredDevicesQuery,
  useClassifyDiscoveredDeviceMutation,
  useDismissDiscoveredDeviceMutation,
  useGetAssignedTelemetryDeviceQuery,
} = telemetryMutations;
