import type { DeviceEntry } from "./types";

export const RFQ_CREATE_REQUEST_SESSION_KEY = "rfq_create_request_session";

export type RfqCreateRequestSession = {
  devices: DeviceEntry[];
  returnHref?: string;
};

export function storeRfqCreateRequestSession(session: RfqCreateRequestSession) {
  if (globalThis.sessionStorage === undefined) {
    return;
  }

  globalThis.sessionStorage.setItem(
    RFQ_CREATE_REQUEST_SESSION_KEY,
    JSON.stringify(session),
  );
}

export function consumeRfqCreateRequestSession(): RfqCreateRequestSession | null {
  if (globalThis.sessionStorage === undefined) {
    return null;
  }

  const raw = globalThis.sessionStorage.getItem(RFQ_CREATE_REQUEST_SESSION_KEY);
  globalThis.sessionStorage.removeItem(RFQ_CREATE_REQUEST_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const session = parsed as RfqCreateRequestSession;
    const devices = Array.isArray(session.devices) ? session.devices : [];

    if (!devices.length && !session.returnHref) {
      return null;
    }

    return {
      devices,
      returnHref:
        typeof session.returnHref === "string" && session.returnHref.length > 0
          ? session.returnHref
          : undefined,
    };
  } catch {
    return null;
  }
}
