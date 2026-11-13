"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useAddEquipmentDocumentMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/addEquipmentDocument";
import { FileUpload } from "@/components/application/file-upload/file-upload-drop-zone";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { Input } from "@/components/base/input/input";
import { AddEquipmentDocumentRequest } from "@/types/equipments";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import {
  ADD_DOCUMENT_ACCEPT,
  ADD_DOCUMENT_HINT,
  ADD_DOCUMENT_MAX_SIZE,
} from "./addDocumentConstants";
import {
  canSubmitAddDocument,
  getAddDocumentSubmitDisabledReason,
} from "./addDocumentForm";
import AddDocumentSelectedFile from "./AddDocumentSelectedFile";
import { addDocumentSchema } from "./validation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: string;
  companyId: string;
}

const AddDocument = ({ isOpen, onClose, equipmentId, companyId }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [addEquipmentDocument, { isLoading }] =
    useAddEquipmentDocumentMutation();

  const form = useForm<z.infer<typeof addDocumentSchema>>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: {
      document_name: "",
      add_members: undefined,
    },
    mode: "onChange",
  });

  const documentName = form.watch("document_name");

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      form.reset();
    }
  }, [form, isOpen]);

  const onSubmit = async (data: z.infer<typeof addDocumentSchema>) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("name", data.document_name);
    formData.append("document", file);

    const payload = {
      companyId,
      equipmentId,
      payload: formData,
    } as AddEquipmentDocumentRequest;

    try {
      await addEquipmentDocument(payload).unwrap();
      displaySuccessMessage(
        "Equipment document added successfully",
        "The equipment document has been added in the company roster.",
      );
      form.reset();
      setFile(null);
      onClose();
    } catch (error) {
      showApiError(error);
    }
  };

  const canSubmit = canSubmitAddDocument(documentName, file, isLoading);

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel="Add document"
      data-testid="adddocument-drawerright"
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <div className="flex flex-col gap-1 pr-8">
          <h2 className="text-lg font-semibold text-primary">Add document</h2>
          <p className="text-sm text-tertiary">Upload your document here.</p>
        </div>
      </SlideoutMenu.Header>

      <SlideoutMenu.Content>
        <form
          id="add-document-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="document_name"
            render={({ field, fieldState }) => (
              <Input
                size="md"
                label="Name of document"
                isRequired
                placeholder="Add document name"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={Boolean(fieldState.error)}
                hint={fieldState.error?.message}
                data-testid="adddocument-input"
              />
            )}
          />

          <FileUpload.DropZone
            accept={ADD_DOCUMENT_ACCEPT}
            allowsMultiple={false}
            maxSize={ADD_DOCUMENT_MAX_SIZE}
            hint={ADD_DOCUMENT_HINT}
            onDropFiles={(files) => setFile(files[0] ?? null)}
          />

          {file ? (
            <AddDocumentSelectedFile
              file={file}
              onRemove={() => setFile(null)}
            />
          ) : null}
        </form>
      </SlideoutMenu.Content>

      <SlideoutMenu.Footer>
        <div className="flex justify-end gap-3">
          <Button
            size="md"
            color="secondary"
            type="button"
            onPress={onClose}
            data-testid="adddocument-button"
          >
            Cancel
          </Button>
          <DisabledWithTooltip
            isDisabled={!canSubmit}
            reason={getAddDocumentSubmitDisabledReason(
              documentName,
              file,
              isLoading,
            )}
          >
            <Button
              size="md"
              color="primary"
              type="submit"
              form="add-document-form"
              isDisabled={!canSubmit}
              isLoading={isLoading}
              data-testid="adddocument-button-2"
            >
              Upload
            </Button>
          </DisabledWithTooltip>
        </div>
      </SlideoutMenu.Footer>
    </SlideoutMenu>
  );
};

export default AddDocument;
