export const canSubmitAddDocument = (
  documentName: string,
  file: File | null,
  isLoading: boolean,
) => documentName.trim().length >= 2 && Boolean(file) && !isLoading;

export const getAddDocumentSubmitDisabledReason = (
  documentName: string,
  file: File | null,
  isLoading: boolean,
) => {
  if (isLoading) return "Uploading document.";
  if (documentName.trim().length < 2) {
    return "Enter a document name with at least 2 characters.";
  }
  if (!file) return "Select a file to upload.";
  return null;
};
