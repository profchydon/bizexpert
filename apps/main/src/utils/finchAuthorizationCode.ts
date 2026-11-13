const inflight = new Map<string, Promise<unknown>>();

export function shouldExchangeFinchAuthorizationCode(input: {
  code?: string | null;
  service?: string | null;
  companyId?: string | null;
}): boolean {
  return Boolean(input.code && input.service === "finch" && input.companyId);
}

export function shouldOpenFinchConfigureTab(input: {
  code?: string | null;
  integration?: string | null;
  slug?: string | null;
  settingsInstance?: boolean;
}): boolean {
  if (input.settingsInstance) {
    return true;
  }

  if (!input.code) {
    return false;
  }

  if (input.integration === "finch") {
    return true;
  }

  return Boolean(
    input.integration && input.slug && input.integration === input.slug,
  );
}

export function shouldStartNewFinchConnect(code?: string | null): boolean {
  return !code;
}

export function exchangeFinchAuthorizationCodeOnce<T>(
  code: string,
  run: () => Promise<T>,
): Promise<T> {
  const existing = inflight.get(code);
  if (existing) {
    return existing as Promise<T>;
  }

  const pending = run();
  inflight.set(code, pending);
  return pending;
}

export function resetFinchAuthorizationCodeExchangeForTests(): void {
  inflight.clear();
}
