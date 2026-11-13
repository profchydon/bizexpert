type EquipmentSpecs =
  | {
      memory?: string | null;
      storage?: string | null;
    }
  | unknown[]
  | null
  | undefined;

const hasValue = (value?: string | null): value is string =>
  Boolean(value?.trim());

export const formatRamStorage = (specs?: EquipmentSpecs): string => {
  if (!specs || Array.isArray(specs)) return "NA";

  const memory = specs.memory?.trim();
  const storage = specs.storage?.trim();

  if (!hasValue(memory) && !hasValue(storage)) return "NA";
  if (hasValue(memory) && hasValue(storage)) return `${memory}/${storage}`;
  return memory || storage || "NA";
};
