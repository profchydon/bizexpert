export function shouldCloseDatePicker(
  date: Date | undefined,
  blocked: boolean,
): boolean {
  return Boolean(date) && !blocked;
}
