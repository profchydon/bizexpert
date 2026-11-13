import type { SelectItemType } from "@/components/base/select/select";

export const CREATE_SELECT_KEY_PREFIX = "create:";
export const EMPTY_CREATABLE_SELECT_ID = "__creatable_empty__";

export function createSelectKey(name: string) {
  return `${CREATE_SELECT_KEY_PREFIX}${name}`;
}

export function parseCreateSelectKey(key: string) {
  if (!key.startsWith(CREATE_SELECT_KEY_PREFIX)) {
    return null;
  }
  return key.slice(CREATE_SELECT_KEY_PREFIX.length);
}

export function buildCreatableSelectItems(
  items: SelectItemType[],
  query: string,
  emptyLabel?: string,
): SelectItemType[] {
  const trimmed = query.trim();
  const lowered = trimmed.toLowerCase();
  const filtered = trimmed
    ? items.filter((item) => item.label?.toLowerCase().includes(lowered))
    : items;

  if (!trimmed) {
    if (filtered.length === 0 && emptyLabel) {
      return [
        {
          id: EMPTY_CREATABLE_SELECT_ID,
          label: emptyLabel,
          isDisabled: true,
        },
      ];
    }
    return filtered;
  }

  const alreadyExists = items.some(
    (item) => item.label?.trim().toLowerCase() === lowered,
  );
  if (alreadyExists) {
    return filtered;
  }

  return [
    ...filtered,
    {
      id: createSelectKey(trimmed),
      label: `Create "${trimmed}"`,
    },
  ];
}
