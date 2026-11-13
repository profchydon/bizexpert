export async function parseStorageExportErrorBlob(
  blob: Blob,
): Promise<string | null> {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text) as { message?: string };
    return typeof parsed.message === "string" ? parsed.message : null;
  } catch {
    return null;
  }
}
