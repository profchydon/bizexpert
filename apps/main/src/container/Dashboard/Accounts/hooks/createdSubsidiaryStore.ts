import type { Subsidiary } from "../types";

let created: Subsidiary[] = [];
const listeners = new Set<() => void>();
const emptySnapshot: Subsidiary[] = [];

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCreatedSubsidiaries(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getCreatedSubsidiariesSnapshot(): Subsidiary[] {
  return created.length === 0 ? emptySnapshot : created;
}

export function createdSubsidiaryCount() {
  return created.length;
}

export function addCreatedSubsidiary(subsidiary: Subsidiary) {
  created = [subsidiary, ...created];
  emit();
}

export function resetCreatedSubsidiariesForTests() {
  created = [];
  listeners.clear();
}
