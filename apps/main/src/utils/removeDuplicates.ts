type UniquePropertyExtractor<T> = keyof T;

export function removeDuplicates<T>(
  arr: T[],
  property: UniquePropertyExtractor<T>,
): T[] {
  const seen = new Set<T[UniquePropertyExtractor<T>]>();
  return arr?.filter((item) => {
    const value = item[property];
    if (seen?.has(value)) {
      return false;
    }
    seen?.add(value);
    return true;
  });
}
