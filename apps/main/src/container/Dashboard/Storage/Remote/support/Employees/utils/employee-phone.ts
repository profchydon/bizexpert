// Deterministic phone number from an employee id — same algorithm getEmployeePhone
// used, extracted standalone (no Employee import) so the seed can bake it in.
export function makePhoneFromId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) | 0;
  const seed = Math.abs(h);
  const area = 200 + (seed % 800);
  const line = seed % 200;
  return `(${area}) 555-${String(line).padStart(4, "0")}`;
}
