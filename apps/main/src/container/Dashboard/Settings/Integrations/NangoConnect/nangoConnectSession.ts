export type NangoConnectUiEvent = {
  type?: string;
  payload?: {
    connectionId?: string;
    errorMessage?: string;
  };
};

export type NangoConnectSessionState = {
  connectionId: string | null;
  settled: boolean;
};

export type NangoConnectSessionResult =
  | { status: "pending" }
  | { status: "connected"; connectionId: string }
  | { status: "cancelled" }
  | { status: "error"; message: string };

export function reduceNangoConnectSession(
  state: NangoConnectSessionState,
  event: NangoConnectUiEvent,
): { state: NangoConnectSessionState; result: NangoConnectSessionResult } {
  if (state.settled) {
    return { state, result: { status: "pending" } };
  }

  if (event.type === "connect" && event.payload?.connectionId) {
    return {
      state: { ...state, connectionId: event.payload.connectionId },
      result: { status: "pending" },
    };
  }

  if (event.type === "error") {
    return {
      state: { ...state, settled: true },
      result: {
        status: "error",
        message: event.payload?.errorMessage || "Nango connect failed",
      },
    };
  }

  if (event.type === "close") {
    if (state.connectionId) {
      return {
        state: { ...state, settled: true },
        result: { status: "connected", connectionId: state.connectionId },
      };
    }

    return {
      state: { ...state, settled: true },
      result: { status: "cancelled" },
    };
  }

  return { state, result: { status: "pending" } };
}
