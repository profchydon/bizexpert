export type OfficeAssetHolder =
  | { kind: "area"; id: string }
  | { kind: "employee"; id: string };

export function officeAssetHolderKey(holder: OfficeAssetHolder): string {
  return holder.kind === "area" ? `area:${holder.id}` : `employee:${holder.id}`;
}

export function parseOfficeAssetHolder(
  value: string | null,
): OfficeAssetHolder | null {
  if (!value) return null;
  if (value.startsWith("area:")) {
    const id = value.slice("area:".length);
    return id ? { kind: "area", id } : null;
  }
  if (value.startsWith("employee:")) {
    const id = value.slice("employee:".length);
    return id ? { kind: "employee", id } : null;
  }
  return null;
}
