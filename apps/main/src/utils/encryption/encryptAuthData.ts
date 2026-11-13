import CryptoJS from "crypto-js";
import { AuthState } from "@/utils/useAuthUser";
import { clearAuthToken, getAuthToken, setAuthToken } from "./authTokenStorage";
import { getClientEncryptKey } from "./getClientEncryptKey";

export type AuthProfile = Pick<
  AuthState,
  "user" | "company" | "entities" | "impersonation"
>;

function encryptJson(value: unknown): string {
  return CryptoJS.AES.encrypt(
    JSON.stringify(value),
    getClientEncryptKey(),
  ).toString();
}

function decryptJson<T>(payload: string): T | undefined {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      payload,
      getClientEncryptKey(),
    ).toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      return undefined;
    }

    return JSON.parse(decrypted) as T;
  } catch {
    return undefined;
  }
}

export function encryptAuthProfile(profile: AuthProfile): string {
  return encryptJson(profile);
}

export function decryptAuthProfile(
  payload: string | null | undefined,
): AuthProfile | undefined {
  if (!payload) {
    return undefined;
  }

  return decryptJson<AuthProfile>(payload);
}

function decryptLegacyAuthBlob(payload: string): AuthState | undefined {
  return decryptJson<AuthState>(payload);
}

export function persistAuthSession(state: AuthState): string {
  if (state.auth_token) {
    setAuthToken(state.auth_token);
  } else {
    clearAuthToken();
  }

  return encryptAuthProfile({
    user: state.user,
    company: state.company,
    entities: state.entities,
    impersonation: state.impersonation,
  });
}

export function readAuthSession(
  encryptedProfile: string | null | undefined,
): AuthState | undefined {
  if (encryptedProfile) {
    const legacy = decryptLegacyAuthBlob(encryptedProfile);

    if (legacy?.auth_token) {
      setAuthToken(legacy.auth_token);

      return {
        auth_token: legacy.auth_token,
        user: legacy.user,
        company: legacy.company,
        entities: legacy.entities,
        impersonation: legacy.impersonation,
      };
    }
  }

  const profile = decryptAuthProfile(encryptedProfile);
  const sessionToken = getAuthToken();

  if (profile?.user || profile?.company || sessionToken) {
    return {
      auth_token: sessionToken,
      user: profile?.user,
      company: profile?.company,
      entities: profile?.entities,
      impersonation: profile?.impersonation,
    };
  }

  return undefined;
}

export const encryptAuthData = persistAuthSession;

export const decryptedAuthData = readAuthSession;
