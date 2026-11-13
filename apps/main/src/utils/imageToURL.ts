export const getImageUrl = (file: File): string | null => {
  if (!file) return null;
  return URL.createObjectURL(file);
};
