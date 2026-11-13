import { reduceNangoConnectSession } from "./nangoConnectSession";

export async function openNangoConnectUi(
  sessionToken: string,
): Promise<string> {
  const { default: Nango } = await import("@nangohq/frontend");
  const nango = new Nango({ connectSessionToken: sessionToken });

  return new Promise((resolve, reject) => {
    let session = { connectionId: null as string | null, settled: false };

    nango.openConnectUI({
      onEvent: (event) => {
        const next = reduceNangoConnectSession(session, {
          type: event.type,
          payload:
            event.type === "connect"
              ? { connectionId: event.payload.connectionId }
              : event.type === "error"
                ? { errorMessage: event.payload.errorMessage }
                : undefined,
        });
        session = next.state;

        if (next.result.status === "connected") {
          resolve(next.result.connectionId);
          return;
        }

        if (next.result.status === "cancelled") {
          reject(new Error("Nango connect closed"));
          return;
        }

        if (next.result.status === "error") {
          reject(new Error(next.result.message));
        }
      },
    });
  });
}
