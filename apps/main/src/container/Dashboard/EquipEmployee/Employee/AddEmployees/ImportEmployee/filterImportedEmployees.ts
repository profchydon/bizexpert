import type { IEmployees } from "@/types/employees";

export function filterImportedEmployees(items: IEmployees[]): IEmployees[] {
  const seenByEmail = new Set<string>();
  const seenByProperties = new Set<string>();

  return items.filter((item) => {
    const id = typeof item?.id === "string" ? item.id.trim() : "";
    const level = typeof item?.level === "string" ? item.level.trim() : "";
    const email = typeof item.email === "string" ? item.email.trim() : "";
    const uniqueKey = `${id}-${level}-${email}`;

    if (email) {
      if (!seenByEmail.has(email)) {
        seenByEmail.add(email);
        return true;
      }
      return false;
    }

    if (id && level) {
      const duplicateLevelEmail = Array.from(seenByProperties).some((key) => {
        const [, storedLevel, storedEmail] = key.split("-");
        return storedLevel === level && storedEmail === email;
      });

      if (!duplicateLevelEmail && !seenByProperties.has(uniqueKey)) {
        seenByProperties.add(uniqueKey);
        return true;
      }
      return false;
    }

    return false;
  });
}
