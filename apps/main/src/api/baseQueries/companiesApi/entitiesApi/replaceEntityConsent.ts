import { companiesApi } from "..";
import type {
  StartEntityConsentData,
  StartEntityConsentRequest,
} from "./startEntityConsent";

const replaceEntityConsent = companiesApi.injectEndpoints({
  endpoints: (mutation) => ({
    replaceEntityConsent: mutation.mutation<
      ServerResponse<StartEntityConsentData>,
      { entityId: string; body: StartEntityConsentRequest }
    >({
      query: ({ entityId, body }) => ({
        url: `/${entityId}/consent/replace`,
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

export const { useReplaceEntityConsentMutation } = replaceEntityConsent;
