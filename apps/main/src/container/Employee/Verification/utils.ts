// Pattern: Builder - incrementally composes a display-ready address string.
export const buildAddress = (...parts: Array<string | undefined>) =>
  parts.filter(Boolean).join(", ");
