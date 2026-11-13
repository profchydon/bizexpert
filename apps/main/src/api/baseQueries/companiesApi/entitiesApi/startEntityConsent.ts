import { companiesApi } from "..";
import type { EntityConsentPayload } from "./resolveEntityCardCapture";

export type StartEntityConsentRequest = {
  return_path: string;
};

export type StartEntityConsentData = {
  consent: EntityConsentPayload;
};

const startEntityConsent = companiesApi.injectEndpoints({
  endpoints: (mutation) => ({
    startEntityConsent: mutation.mutation<
      ServerResponse<StartEntityConsentData>,
      { entityId: string; body: StartEntityConsentRequest }
    >({
      query: ({ entityId, body }) => ({
        url: `/${entityId}/consent/start`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (result, error, { entityId }) => [
        { type: "Entities", id: entityId },
        "Entities",
      ],
    }),
  }),
});

export const { useStartEntityConsentMutation } = startEntityConsent;
