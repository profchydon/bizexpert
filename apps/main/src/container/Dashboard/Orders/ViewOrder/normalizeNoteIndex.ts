export const normalizeNoteIndex = (
  noteIndexParam: string | null,
  notesLength: number,
): number | null => {
  if (!noteIndexParam || !Number.isFinite(Number(noteIndexParam))) {
    return null;
  }

  const rawIndex = Math.trunc(Number(noteIndexParam));
  if (rawIndex >= 0 && rawIndex < notesLength) {
    return rawIndex;
  }

  const oneBasedIndex = rawIndex - 1;
  if (oneBasedIndex >= 0 && oneBasedIndex < notesLength) {
    return oneBasedIndex;
  }

  return null;
};
