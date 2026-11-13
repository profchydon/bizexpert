import { FileIcon } from "@untitledui/file-icons";

const CATEGORY_MAP: Record<string, string> = {
  mov: "video",
  webm: "video",
  flv: "video",
  wmv: "video",
  m4v: "video",
  aac: "audio",
  flac: "audio",
  ogg: "audio",
  wma: "audio",
  m4a: "audio",
  bmp: "image",
  ico: "image",
  heic: "image",
  heif: "image",
  raw: "image",
  rtf: "document",
  odt: "document",
  pages: "document",
  ods: "spreadsheets",
  numbers: "spreadsheets",
  tsv: "spreadsheets",
  tar: "zip",
  gz: "zip",
  "7z": "zip",
  ts: "code",
  tsx: "code",
  py: "code",
  rb: "code",
  go: "code",
  rs: "code",
  key: "pptx",
  odp: "pptx",
};

function resolveType(ext: string): string {
  const lower = ext.toLowerCase();
  return CATEGORY_MAP[lower] ?? lower;
}

function FileTypeIcon({ ext, className }: { ext: string; className?: string }) {
  return <FileIcon type={resolveType(ext)} size={40} className={className} />;
}

export { FileTypeIcon };
