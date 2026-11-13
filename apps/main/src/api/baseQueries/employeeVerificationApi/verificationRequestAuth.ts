export const verificationRequestAuth = {
  skipAuth: true,
} as const;

export const verificationRequestParams = (token: string) => ({
  token,
  excludePathFromEncryption: true,
});
