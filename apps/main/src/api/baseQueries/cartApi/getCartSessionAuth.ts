import { reduxStore } from "@/store";
import { decryptedAuthData } from "@/utils/encryption/encryptAuthData";
import type { AuthState } from "@/utils/useAuthUser";
import { resolveWorkspaceApiCompanyId } from "@/utils/workspace/workspaceApiCompanyId";

export function getCartSessionAuth() {
  const persisted = reduxStore.getState().persistedReducers;
  const auth = decryptedAuthData(persisted.auth.authData) as AuthState | null;

  return {
    userId: auth?.user?.id,
    companyId: resolveWorkspaceApiCompanyId(
      auth?.company?.id,
      persisted.workspaceScope.activeEntityId,
    ),
  };
}
