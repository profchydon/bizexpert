export interface OfficeAreaRemoveCopy {
  blocked: boolean;
  title: string;
  body: string;
}

export function buildOfficeAreaRemoveCopy(
  areaName: string,
  assetCount: number,
): OfficeAreaRemoveCopy {
  const name = areaName || "area";
  if (assetCount > 0) {
    return {
      blocked: true,
      title: "Reassign assets first",
      body: `${name} still holds ${assetCount} asset${
        assetCount === 1 ? "" : "s"
      }. Move them to another area, then remove it.`,
    };
  }
  return {
    blocked: false,
    title: `Remove ${name}?`,
    body: `${name} will no longer be available when placing assets. This can't be undone.`,
  };
}
