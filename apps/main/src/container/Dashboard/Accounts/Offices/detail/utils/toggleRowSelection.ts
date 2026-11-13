export function toggleRowSelection(
  selected: Set<string>,
  id: string,
): Set<string> {
  return selected.has(id)
    ? new Set([...selected].filter((entry) => entry !== id))
    : new Set([...selected, id]);
}
