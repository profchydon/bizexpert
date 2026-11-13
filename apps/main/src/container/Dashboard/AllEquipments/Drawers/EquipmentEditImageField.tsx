"use client";

import { Trash01 } from "@untitledui/icons";
import { useEffect, useMemo, useState } from "react";
import { FileUpload } from "@/components/application/file-upload/file-upload-drop-zone";
import { Button } from "@/components/base/buttons/button";

const ACCEPT = ".png,.jpg,.jpeg,image/png,image/jpeg";
const HINT = "PNG or JPG";

type Props = {
  images: File[] | string[];
  onChange: (images: File[] | string[]) => void;
};

const EquipmentEditImageField = ({ images, onChange }: Props) => {
  const [removed, setRemoved] = useState(false);
  const uploadedFile = images[0] instanceof File ? images[0] : undefined;
  const existingUrl =
    typeof images[0] === "string" ? (images[0] as string) : undefined;

  const uploadedSrc = useMemo(
    () => (uploadedFile ? URL.createObjectURL(uploadedFile) : undefined),
    [uploadedFile],
  );

  useEffect(() => {
    if (!uploadedSrc) return;
    return () => URL.revokeObjectURL(uploadedSrc);
  }, [uploadedSrc]);

  const previewSrc = uploadedSrc ?? (removed ? undefined : existingUrl);

  return (
    <div className="col-span-2 flex flex-col gap-1.5">
      <p className="text-sm font-medium text-secondary">
        Add asset image (optional)
      </p>
      {previewSrc ? (
        <div className="group relative flex h-44 items-center justify-center overflow-hidden rounded-xl bg-secondary ring-1 ring-secondary ring-inset">
          <img
            src={previewSrc}
            alt="Equipment"
            className="h-full w-full object-contain p-4"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
            <Button
              color="secondary-destructive"
              size="sm"
              iconLeading={Trash01}
              onClick={() => {
                onChange([]);
                setRemoved(true);
              }}
              data-testid="equipmenteditimagefield-button"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <FileUpload.DropZone
          accept={ACCEPT}
          allowsMultiple={false}
          hint={HINT}
          onDropFiles={(files) => {
            setRemoved(false);
            onChange([files[0]]);
          }}
        />
      )}
    </div>
  );
};

export default EquipmentEditImageField;
