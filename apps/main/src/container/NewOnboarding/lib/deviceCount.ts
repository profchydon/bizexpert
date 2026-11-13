export const DEVICE_COUNT_MIN = 1;
export const DEVICE_COUNT_MAX = 100_000;

export function nextDeviceCount(current: string, raw: string) {
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  if (Number(digits) > DEVICE_COUNT_MAX) return current;
  return digits;
}

export function isDeviceCount(value: unknown): value is string {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return false;
  const count = Number(value);
  return count >= DEVICE_COUNT_MIN && count <= DEVICE_COUNT_MAX;
}
