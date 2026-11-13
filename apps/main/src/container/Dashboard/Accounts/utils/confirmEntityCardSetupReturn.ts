import type { ConfirmEntityConsentRequest } from "@/api/baseQueries/companiesApi/entitiesApi/confirmEntityConsent";
import { buildConfirmConsentBody } from "@/api/baseQueries/companiesApi/entitiesApi/buildConfirmConsentBody";

type ConfirmConsentFn = (args: {
  entityId: string;
  body?: ConfirmEntityConsentRequest;
}) => { unwrap: () => Promise<unknown> };

export async function confirmEntityCardSetupReturn(input: {
  entityId: string;
  sessionId?: string | null;
  confirmConsent: ConfirmConsentFn;
}) {
  try {
    await input
      .confirmConsent({
        entityId: input.entityId,
        body: buildConfirmConsentBody(input.sessionId),
      })
      .unwrap();
    return true;
  } catch {
    return false;
  }
}
