export type MultiPickOption = string | { value: string; label: string };

export function normalizeMultiPickOptions(options: MultiPickOption[]) {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}

export function filterMultiPickOptions(
  options: ReturnType<typeof normalizeMultiPickOptions>,
  query: string,
) {
  const search = query.trim().toLowerCase();
  if (!search) return options;

  const startsWith = options.filter((option) =>
    option.label.toLowerCase().startsWith(search),
  );
  if (startsWith.length) return startsWith;

  const wordStartsWith = options.filter((option) =>
    option.label
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .some((word) => word.startsWith(search)),
  );
  if (wordStartsWith.length) return wordStartsWith;

  return options.filter((option) =>
    option.label.toLowerCase().includes(search),
  );
}

export function removeMultiPickValue(values: string[], value: string) {
  return values.filter((item) => item !== value);
}
