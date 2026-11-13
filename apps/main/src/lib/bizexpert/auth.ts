import type { Business, User } from "@/types/bizexpert";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getBusiness(): Business | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("business");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Business;
  } catch {
    return null;
  }
}

export function setBusiness(business: Business): void {
  localStorage.setItem("business", JSON.stringify(business));
}

export function clearAuth(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("business");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
