const INVALID_IDS = new Set(["", "null", "undefined"]);

export const isUsableEquipmentId = (value: unknown): value is string =>
  typeof value === "string" && !INVALID_IDS.has(value.trim());

export const resolveReassignEquipmentIds = ({
  equipID,
  selectedRows,
  singleEquipmentData,
}: {
  equipID?: string | null;
  selectedRows?: Array<{ id?: string | null }>;
  singleEquipmentData?: { id?: string | null };
}): string[] => {
  const fromRows = (selectedRows ?? [])
    .map((row) => row?.id)
    .filter(isUsableEquipmentId);

  if (fromRows.length > 0) {
    return [...new Set(fromRows)];
  }

  if (isUsableEquipmentId(equipID)) {
    return [equipID];
  }

  if (isUsableEquipmentId(singleEquipmentData?.id)) {
    return [singleEquipmentData.id];
  }

  return [];
};

export const resolveSystemReassignEquipId = (
  selectedRows: Array<{ id?: string | null }>,
  item?: { id?: string | null },
): string | null =>
  resolveReassignEquipmentIds({
    selectedRows,
    equipID: item?.id,
  })[0] ?? null;
