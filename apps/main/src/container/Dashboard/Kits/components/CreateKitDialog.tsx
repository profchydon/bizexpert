"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/createKit";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";
import type { FulfillmentMode, Kit } from "../types";
import { extractKitErrorMessage } from "../utils";
import KitDetailsFields from "./KitDetailsFields";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (kit: Kit) => void;
}

const CreateKitDialog = ({ open, onClose, onCreated }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fulfillmentMode, setFulfillmentMode] =
    useState<FulfillmentMode>("split");
  const [nameError, setNameError] = useState("");

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const [createKit, { isLoading }] = useCreateKitMutation();

  const reset = () => {
    setName("");
    setDescription("");
    setFulfillmentMode("split");
    setNameError("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const create = async () => {
    const trimmed = name.trim();
    if (!trimmed) return setNameError("Kit name is required.");
    if (!companyId) return;

    try {
      const response = await createKit({
        companyId: companyId,
        payload: {
          name: trimmed,
          description: description.trim() || null,
          fulfillment_mode: fulfillmentMode,
        },
      }).unwrap();
      reset();
      onCreated(response.data);
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to create kit"),
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && close()}
      data-testid="createkitdialog-dialog"
    >
      <DialogContent className="max-w-lg gap-0 p-0" showCloseButton={false}>
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <DialogTitle>Create Kit</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-5">
          <KitDetailsFields
            name={name}
            description={description}
            fulfillmentMode={fulfillmentMode}
            nameError={nameError}
            onNameChange={(value) => {
              setName(value);
              setNameError("");
            }}
            onDescriptionChange={setDescription}
            onFulfillmentModeChange={setFulfillmentMode}
          />
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={close}
            disabled={isLoading}
            data-testid="createkitdialog-button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={create}
            disabled={isLoading}
            data-testid="createkitdialog-button-2"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateKitDialog;
