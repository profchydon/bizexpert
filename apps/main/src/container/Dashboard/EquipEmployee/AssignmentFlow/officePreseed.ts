const KEY = "rr-assign-office-preseed";
const CONTACT_KEY = "rr-assign-office-contact";

export function setOfficePreseed(officeId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, officeId);
  } catch {
    /* ignore */
  }
}

export function readOfficePreseed(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearOfficePreseed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function writeOfficeContactPreseed(contactEmployeeId: string): void {
  if (typeof window === "undefined") return;
  try {
    if (!contactEmployeeId) {
      sessionStorage.removeItem(CONTACT_KEY);
      return;
    }
    sessionStorage.setItem(CONTACT_KEY, contactEmployeeId);
  } catch {
    /* ignore */
  }
}

export function readOfficeContactPreseed(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(CONTACT_KEY);
  } catch {
    return null;
  }
}
