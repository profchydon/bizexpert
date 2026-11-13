"use client";

import { useId, useRef, useState } from "react";
import { UploadCloud02 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import { isAcceptedFileType } from "./isAcceptedFileType";

type FileUploadDropZoneProps = {
  className?: string;
  hint?: string;
  isDisabled?: boolean;
  accept?: string;
  allowsMultiple?: boolean;
  maxSize?: number;
  onDropFiles?: (files: FileList) => void;
  onDropUnacceptedFiles?: (files: FileList) => void;
  onSizeLimitExceed?: (files: FileList) => void;
};

export function FileUploadDropZone({
  className,
  hint,
  isDisabled,
  accept,
  allowsMultiple = true,
  maxSize,
  onDropFiles,
  onDropUnacceptedFiles,
  onSizeLimitExceed,
}: FileUploadDropZoneProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const processFiles = (files: File[]) => {
    setIsInvalid(false);

    const acceptedFiles: File[] = [];
    const unacceptedFiles: File[] = [];
    const oversizedFiles: File[] = [];
    const filesToProcess = allowsMultiple ? files : files.slice(0, 1);

    filesToProcess.forEach((file) => {
      if (maxSize && file.size > maxSize) {
        oversizedFiles.push(file);
        return;
      }

      if (isAcceptedFileType(file, accept)) {
        acceptedFiles.push(file);
      } else {
        unacceptedFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0 && onSizeLimitExceed) {
      const dataTransfer = new DataTransfer();
      oversizedFiles.forEach((file) => dataTransfer.items.add(file));
      setIsInvalid(true);
      onSizeLimitExceed(dataTransfer.files);
    }

    if (acceptedFiles.length > 0 && onDropFiles) {
      const dataTransfer = new DataTransfer();
      acceptedFiles.forEach((file) => dataTransfer.items.add(file));
      onDropFiles(dataTransfer.files);
    }

    if (unacceptedFiles.length > 0 && onDropUnacceptedFiles) {
      const dataTransfer = new DataTransfer();
      unacceptedFiles.forEach((file) => dataTransfer.items.add(file));
      setIsInvalid(true);
      onDropUnacceptedFiles(dataTransfer.files);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragIn = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragOut = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  };

  const openFilePicker = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const handleZoneClick = () => {
    if (isDisabled) return;
    openFilePicker();
  };

  const handleZoneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  return (
    <div
      data-dropzone
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleZoneClick}
      onKeyDown={handleZoneKeyDown}
      onDragOver={handleDragIn}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragEnd={handleDragOut}
      onDrop={(event) => {
        if (isDisabled) return;
        handleDragOut(event);
        processFiles(Array.from(event.dataTransfer.files));
      }}
      className={cx(
        "relative flex flex-col items-center gap-3 rounded-xl bg-primary px-6 py-4 text-tertiary ring-1 ring-secondary ring-inset transition duration-100 ease-linear",
        isDraggingOver && "ring-2 ring-brand",
        isDisabled && "cursor-not-allowed opacity-50",
        !isDisabled && "cursor-pointer",
        className,
      )}
    >
      <FeaturedIcon color="gray" theme="modern" size="md">
        <UploadCloud02 className="size-5" />
      </FeaturedIcon>

      <div className="flex flex-col gap-1 text-center">
        <div className="flex justify-center gap-1 text-center">
          <input
            ref={inputRef}
            id={id}
            type="file"
            className="peer sr-only"
            disabled={isDisabled}
            accept={accept}
            multiple={allowsMultiple}
            onChange={(event) =>
              processFiles(Array.from(event.target.files || []))
            }
          />
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-brand-secondary">
              Click to upload
            </span>
            <span className="text-sm max-md:hidden">or drag and drop</span>
          </div>
        </div>
        <p
          className={cx(
            "text-xs transition duration-100 ease-linear",
            isInvalid && "text-error-primary",
          )}
        >
          {hint || "SVG, PNG, JPG or GIF (max. 800x400px)"}
        </p>
      </div>
    </div>
  );
}

export const FileUpload = {
  DropZone: FileUploadDropZone,
};
