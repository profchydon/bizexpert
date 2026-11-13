import { companiesApi } from "..";
import type { CreateEntityData } from "./types";

export type ConfirmEntityConsentRequest = {
  session_id?: string;
};

const confirmEntityConsent = companiesApi.injectEndpoints({
  endpoints: (mutation) => ({
    confirmEntityConsent: mutation.mutation<
      ServerResponse<CreateEntityData>,
      { entityId: string; body?: ConfirmEntityConsentRequest }
    >({
      query: ({ entityId, body }) => ({
        url: `/${entityId}/consent/confirm`,
        method: "POST",
        ...(body ? { data: body } : {}),
      }),
      invalidatesTags: (result, error, { entityId }) => [
        { type: "Entities", id: entityId },
        "Entities",
      ],
    }),
  }),
});

export const { useConfirmEntityConsentMutation } = confirmEntityConsent;
