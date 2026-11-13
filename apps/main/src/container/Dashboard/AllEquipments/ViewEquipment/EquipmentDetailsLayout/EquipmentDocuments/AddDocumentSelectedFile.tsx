"use client";

import { FileIcon } from "@untitledui/file-icons";
import { Trash01 } from "@untitledui/icons";
import { filesize } from "filesize";
import { Button } from "@/components/base/buttons/button";

const fileType = (name: string): "pdf" | "png" | "empty" => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "png" || ext === "jpg" || ext === "jpeg") return "png";
  return "empty";
};

type Props = {
  file: File;
  onRemove: () => void;
};

const AddDocumentSelectedFile = ({ file, onRemove }: Props) => (
  <div className="flex items-center gap-2.5 rounded-lg border border-secondary px-3 py-2">
    <FileIcon
      className="size-8 shrink-0"
      type={fileType(file.name)}
      theme="light"
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-medium text-primary">{file.name}</p>
      <p className="text-xs text-tertiary">
        {filesize(file.size, { standard: "jedec" })}
      </p>
    </div>
    <Button
      color="tertiary"
      size="sm"
      iconLeading={Trash01}
      aria-label={`Remove ${file.name}`}
      onPress={onRemove}
      data-testid="adddocumentselectedfile-button"
    />
  </div>
);

export default AddDocumentSelectedFile;
