export function isAcceptedFileType(file: File, accept?: string) {
  if (!accept) return true;

  const acceptedTypes = accept.split(",").map((type) => type.trim());

  return acceptedTypes.some((acceptedType) => {
    if (acceptedType.startsWith(".")) {
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      return extension === acceptedType.toLowerCase();
    }

    if (acceptedType.endsWith("/*")) {
      const typePrefix = acceptedType.split("/")[0];
      return file.type.startsWith(`${typePrefix}/`);
    }

    return file.type === acceptedType;
  });
}
