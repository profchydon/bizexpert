"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import { useCreateRfqMutation } from "@/api/baseQueries/companiesApi/rfqsApi/createRfq";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppSelector } from "@/store";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { companyBillingCurrency } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import {
  buildRfqDeviceProperties,
  createEmptyDevice,
  formatRfqDeviceDescription,
  isDeviceFilled,
} from "./data";
import { CustomRequestForm } from "./CustomRequestForm";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import type { DeviceEntry } from "./types";

function CustomDeviceRequestModal({
  isOpen,
  onOpenChange,
  prefillDevices,
  returnHref,
}: Readonly<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  prefillDevices?: DeviceEntry[];
  returnHref?: string;
}>) {
  const { push, isPending } = useTransitionRouter();
  const {
    equipEmployee: { country },
  } = useAppSelector((state) => state.persistedReducers);

  const companyId = useWorkspaceCompanyId();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const { data: assetTypesRes } = useGetAssetTypesQuery();
  const [createRfq, createRfqProps] = useCreateRfqMutation();

  const assetTypes = assetTypesRes?.data ?? [];

  const [devices, setDevices] = useState<DeviceEntry[]>([
    createEmptyDevice("1"),
  ]);
  const [nextId, setNextId] = useState(2);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(false);
  const isDeleteDialogOpen = deleteTargetId !== null;
  const isCustomRequestModalOpen = isOpen && !isDeleteDialogOpen;

  useEffect(() => {
    if (!isOpen || !prefillDevices?.length) {
      return;
    }

    setDevices(prefillDevices);
    setNextId(prefillDevices.length + 1);
    setDeleteTargetId(null);
  }, [isOpen, prefillDevices]);

  const isFormValid = useMemo(() => devices.every(isDeviceFilled), [devices]);

  const totalBudget = useMemo(
    () =>
      devices.reduce(
        (sum, device) =>
          sum +
          (Number.parseInt(device.budgetPrice, 10) || 0) *
            (Number.parseInt(device.quantity, 10) || 0),
        0,
      ),
    [devices],
  );

  const handleAddDevice = useCallback(() => {
    setDevices((prev) => [...prev, createEmptyDevice(String(nextId))]);
    setNextId((prev) => prev + 1);
  }, [nextId]);

  const handleUpdateDevice = useCallback((id: string, updated: DeviceEntry) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === id ? updated : device)),
    );
  }, []);

  const handleRequestDelete = useCallback(
    (id: string) => {
      if (skipDeleteConfirm) {
        setDevices((prev) => prev.filter((device) => device.id !== id));
        return;
      }
      setDeleteTargetId(id);
    },
    [skipDeleteConfirm],
  );

  const resetForm = useCallback(() => {
    setDevices([createEmptyDevice("1")]);
    setNextId(2);
    setDeleteTargetId(null);
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    resetForm();
  }, [onOpenChange, resetForm]);

  const handleDismiss = useCallback(() => {
    onOpenChange(false);
    resetForm();

    if (returnHref) {
      push(returnHref);
    }
  }, [onOpenChange, push, resetForm, returnHref]);

  const handleSubmitRequest = useCallback(async () => {
    if (!companyId) {
      displayErrorMessage(
        "Unable to submit request",
        "Company information is unavailable.",
      );
      return;
    }

    if (!country?.id) {
      displayErrorMessage(
        "Unable to submit request",
        "Please select a country before submitting.",
      );
      return;
    }

    const payload = {
      country_id: country.id,
      currency_code: companyBillingCurrency(company) || "USD",
      devices: devices.map((device) => ({
        name: device.deviceName.trim(),
        description: formatRfqDeviceDescription(device),
        quantity: Number.parseInt(device.quantity, 10) || 0,
        budget_per_unit: Number.parseInt(device.budgetPrice, 10) || 0,
        asset_type: device.assetType,
        properties: buildRfqDeviceProperties(device),
      })),
    };

    try {
      await createRfq({ companyId, payload }).unwrap();
      displaySuccessMessage(
        "Request submitted",
        "Your custom device request has been submitted successfully.",
      );
      handleClose();
    } catch (error: any) {
      displayErrorMessage(
        "Unable to submit request",
        error?.data?.message || "Failed to submit custom device request",
      );
    }
  }, [company, companyId, country?.id, createRfq, devices, handleClose]);

  return (
    <>
      <Dialog
        open={isCustomRequestModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (isDeleteDialogOpen) {
              return;
            }
            handleDismiss();
            return;
          }
          onOpenChange(open);
        }}
        data-testid="customdevicerequestmodal-dialog"
      >
        <DialogContent className="max-w-[560px] p-0" showCloseButton={false}>
          <CustomRequestForm
            devices={devices}
            isFormValid={isFormValid}
            isSubmitting={createRfqProps.isLoading}
            assetTypes={assetTypes}
            totalBudget={totalBudget}
            onAddDevice={handleAddDevice}
            onClose={handleDismiss}
            isCloseLoading={Boolean(returnHref) && isPending}
            onDeleteDevice={handleRequestDelete}
            onSubmit={handleSubmitRequest}
            onUpdateDevice={handleUpdateDevice}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={() => {
          if (!deleteTargetId) {
            return;
          }
          setDevices((prev) =>
            prev.filter((device) => device.id !== deleteTargetId),
          );
          setDeleteTargetId(null);
        }}
        onCancel={() => setDeleteTargetId(null)}
        skipConfirm={skipDeleteConfirm}
        onSkipConfirmChange={setSkipDeleteConfirm}
      />
    </>
  );
}

export { CustomDeviceRequestModal };
