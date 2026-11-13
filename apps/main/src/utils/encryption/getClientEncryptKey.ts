const CLIENT_ENCRYPT_KEY_ENV = "NEXT_PUBLIC_ENCRYPT_KEY";

export function getClientEncryptKey(): string {
  const key = process.env[CLIENT_ENCRYPT_KEY_ENV];

  if (!key) {
    throw new Error(`${CLIENT_ENCRYPT_KEY_ENV} is not configured`);
  }

  return key;
}

export function hasClientEncryptKey(): boolean {
  return Boolean(process.env[CLIENT_ENCRYPT_KEY_ENV]);
}
