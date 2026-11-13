"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAddKitItemsMutation } from "@/api/baseQueries/companiesApi/kitsApi/addKitItems";
import { useCreateKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/createKit";
import { useLazyGetKitItemsQuery } from "@/api/baseQueries/companiesApi/kitsApi/getKitItems";
import type { IKitItem } from "@/types/kit";
import displayErrorMessage from "@/utils/displayErrorMessage";
import routes from "@/routes";
import type { FulfillmentMode, Kit, KitListItem } from "../types";
import { extractKitErrorMessage, getKitFulfillmentMode } from "../utils";
import KitDetailsFields from "./KitDetailsFields";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  sourceKit: Kit | KitListItem | null;
  onClose: () => void;
  onDuplicated?: (kit: Kit) => void;
}

const DuplicateKitDialog = ({ sourceKit, onClose, onDuplicated }: Props) => {
  const router = useRouter();
  const [successKit, setSuccessKit] = useState<Kit | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<FulfillmentMode>("split");
  const [nameError, setNameError] = useState("");

  const companyId = useWorkspaceCompanyId();
  const [createKit, { isLoading: isCreating }] = useCreateKitMutation();
  const [addKitItems, { isLoading: isAddingItems }] = useAddKitItemsMutation();
  const [fetchSourceItems, { isFetching: isFetchingItems }] =
    useLazyGetKitItemsQuery();

  const isLoading = isCreating || isAddingItems || isFetchingItems;

  useEffect(() => {
    if (!sourceKit) return;
    const sourceName = sourceKit.name ?? "Untitled kit";
    const sourceDescription =
      "description" in sourceKit ? (sourceKit.description ?? "") : "";
    setName(`${sourceName} Copy`);
    setDescription(sourceDescription);
    setMode(getKitFulfillmentMode(sourceKit.fulfillment_mode));
    setNameError("");
  }, [sourceKit]);

  const fetchAllSourceItems = async (
    companyId: string,
    kitId: string,
  ): Promise<IKitItem[]> => {
    const collected: IKitItem[] = [];
    let page = 1;
    let lastPage = 1;
    do {
      const response = await fetchSourceItems({
        companyId,
        kitId,
        params: {
          sort_by: "sort_order",
          sort_order: "asc",
          per_page: 100,
          page,
        },
      }).unwrap();
      const pageItems = response.data?.data ?? [];
      collected.push(...pageItems);
      lastPage = response.data?.last_page ?? page;
      page += 1;
    } while (page <= lastPage);
    return collected;
  };

  const duplicate = async () => {
    if (!sourceKit || !companyId) return;
    const trimmed = name.trim();
    if (!trimmed) return setNameError("Kit name is required.");

    try {
      const sourceItems = await fetchAllSourceItems(companyId, sourceKit.id);

      const created = await createKit({
        companyId: companyId,
        payload: {
          name: trimmed,
          description: description.trim() || null,
          fulfillment_mode: mode,
        },
      }).unwrap();

      const kit = created.data;

      if (sourceItems.length > 0) {
        await addKitItems({
          companyId: companyId,
          kitId: kit.id,
          payload: {
            items: sourceItems.map((item) => ({
              asset_specification_id: item.asset_specification_id,
              required: item.required,
              quantity: item.quantity,
            })),
          },
        }).unwrap();
      }

      onDuplicated?.(kit);
      setSuccessKit(kit);
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to duplicate kit"),
      );
    }
  };

  return (
    <>
      <Dialog
        open={Boolean(sourceKit) && !successKit}
        onOpenChange={(open) => !open && onClose()}
        data-testid="duplicatekitdialog-dialog"
      >
        <DialogContent className="max-w-lg gap-0 p-0" showCloseButton={false}>
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Duplicate Kit
            </DialogTitle>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="px-6 py-5">
            <KitDetailsFields
              name={name}
              description={description}
              fulfillmentMode={mode}
              nameError={nameError}
              onNameChange={(value) => {
                setName(value);
                setNameError("");
              }}
              onDescriptionChange={setDescription}
              onFulfillmentModeChange={setMode}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              data-testid="duplicatekitdialog-button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={duplicate}
              disabled={isLoading}
              data-testid="duplicatekitdialog-button-2"
            >
              {isLoading ? "Duplicating..." : "Duplicate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(successKit)}
        onOpenChange={() => {
          setSuccessKit(null);
          onClose();
        }}
        data-testid="duplicatekitdialog-dialog-2"
      >
        <DialogContent className="max-w-md p-6" showCloseButton={false}>
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-success-100">
              <CheckCircle className="size-6 text-success-600" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Kit Duplicated
              </DialogTitle>
              <p className="text-sm text-gray-600">
                <strong>{successKit?.name ?? "Kit"}</strong> has been created.
                Would you like to go to the new kit?
              </p>
            </div>
            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSuccessKit(null);
                  onClose();
                }}
                data-testid="duplicatekitdialog-button-3"
              >
                Stay Here
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (!successKit) return;
                  const kitId = successKit.id;
                  setSuccessKit(null);
                  onClose();
                  router.push(routes.KIT_DETAIL(kitId));
                }}
                data-testid="duplicatekitdialog-button-4"
              >
                Go to Kit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DuplicateKitDialog;
