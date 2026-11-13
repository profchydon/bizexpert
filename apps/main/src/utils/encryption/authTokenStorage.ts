const AUTH_TOKEN_STORAGE_KEY = "rv2_auth_token";

type WebStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isUsableStorage(storage: unknown): storage is WebStorage {
  const candidate = storage as WebStorage | undefined;

  return (
    typeof candidate?.getItem === "function" &&
    typeof candidate?.setItem === "function" &&
    typeof candidate?.removeItem === "function"
  );
}

function readStorage(kind: "localStorage" | "sessionStorage") {
  try {
    const storage = globalThis[kind];

    return isUsableStorage(storage) ? storage : undefined;
  } catch {
    return undefined;
  }
}

function getSharedStorage(): WebStorage | undefined {
  return readStorage("localStorage");
}

function getTabStorage(): WebStorage | undefined {
  return readStorage("sessionStorage");
}

export function setAuthToken(token: string): void {
  const shared = getSharedStorage();

  if (shared) {
    shared.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    getTabStorage()?.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return;
  }

  getTabStorage()?.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function getAuthToken(): string | null {
  const sharedToken =
    getSharedStorage()?.getItem(AUTH_TOKEN_STORAGE_KEY) ?? null;

  if (sharedToken) {
    return sharedToken;
  }

  const tabToken = getTabStorage()?.getItem(AUTH_TOKEN_STORAGE_KEY) ?? null;

  if (tabToken) {
    setAuthToken(tabToken);
  }

  return tabToken;
}

export function clearAuthToken(): void {
  getSharedStorage()?.removeItem(AUTH_TOKEN_STORAGE_KEY);
  getTabStorage()?.removeItem(AUTH_TOKEN_STORAGE_KEY);
}
