export const blobUrlToFile = async (blobUrl: string): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  const mimeString = blob.type;

  const extension = mimeString.split("/")[1];
  const timestamp = new Date().getTime();
  const filename = `file_${timestamp}.${extension}`;

  return new File([blob], filename, { type: mimeString });
};
