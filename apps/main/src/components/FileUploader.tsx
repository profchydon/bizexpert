"use client";

import displayErrorMessage from "@/utils/displayErrorMessage";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";

const MAXSIZE = 10000000;
interface FileUploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
  emptyState?: string;
  emptyStateSize?: Record<string, number>;
  accept?: any;
  height: any;
  acceptanceText?: string;
  onFileDialogCancel?: () => void;
  hideOnDropValue?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = (props) => {
  const {
    onDrop,
    onFileDialogCancel,
    emptyState,
    accept,
    emptyStateSize,
    height,
    acceptanceText,
    hideOnDropValue,
  } = props;

  function sizeValidator(file: File) {
    if (file.size > MAXSIZE) {
      displayErrorMessage("File larger than 500KB");
    }

    return null;
  }

  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop],
  );

  const dropzoneOptions: DropzoneOptions = {
    onDrop: onDropCallback,
    onFileDialogCancel,
    accept,
    maxSize: MAXSIZE,
    validator: sizeValidator,
    multiple: false,
  };

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone(dropzoneOptions);

  return (
    <div
      style={height && { height }}
      {...getRootProps()}
      className={`${
        isDragAccept
          ? "border-success-400 border"
          : isDragReject
            ? "border-error-400 border"
            : isFocused
              ? "border-primary-400 border"
              : "border-gray-300 border"
      } flex flex-col justify-center items-center rounded-lg text-center `}
    >
      <input {...getInputProps()} />
      {acceptedFiles?.length === 0 ? (
        <div className="flex flex-col items-center m-auto justify-center">
          {emptyState && (
            <Image
              src={emptyState || ""}
              alt="emptyState"
              width={emptyStateSize?.width}
              height={emptyStateSize?.height}
            />
          )}
          <div className="flex flex-col text-center">
            <div className="flex gap-x-1 justify-center">
              <span className="text-primary-700 font-semibold text-sm cursor-pointer">
                Click to upload
              </span>{" "}
              <span className="text-gray-600 text-sm">or drag and drop</span>
            </div>
            <span className="text-gray-600 text-xs">
              {acceptanceText || "XLSX"}
            </span>
          </div>
        </div>
      ) : !hideOnDropValue ? (
        <div>
          <p>Accepted Files:</p>
          <ul>
            {acceptedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center m-auto justify-center">
          {emptyState && (
            <Image
              src={emptyState || ""}
              alt="emptyState"
              width={emptyStateSize?.width}
              height={emptyStateSize?.height}
            />
          )}
          <div className="flex flex-col text-center">
            <div className="flex gap-x-1 justify-center">
              <span className="text-primary-700 font-semibold text-sm cursor-pointer">
                Click to upload
              </span>{" "}
              <span className="text-gray-600 text-sm">or drag and drop</span>
            </div>
            <span className="text-gray-600 text-xs">
              {acceptanceText || "XLSX"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
