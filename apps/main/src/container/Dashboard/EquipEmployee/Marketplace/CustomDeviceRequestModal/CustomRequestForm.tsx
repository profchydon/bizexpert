import { Plus, X } from "lucide-react";
import type { IAssetCategory } from "@/types/assets";
import CustomTooltip from "@/components/CustomTooltip";
import { Button } from "@/components/ui/button";
import { getCustomRequestSubmitDisabledReason } from "./data";
import { DeviceEntrySection } from "./DeviceEntrySection";
import type { DeviceEntry } from "./types";

function CustomRequestForm({
  devices,
  isFormValid,
  isSubmitting,
  assetTypes,
  onAddDevice,
  onClose,
  isCloseLoading = false,
  onDeleteDevice,
  onSubmit,
  onUpdateDevice,
  totalBudget,
}: Readonly<{
  devices: DeviceEntry[];
  isFormValid: boolean;
  isSubmitting: boolean;
  assetTypes: IAssetCategory[];
  onAddDevice: () => void;
  onClose: () => void;
  isCloseLoading?: boolean;
  onDeleteDevice: (id: string) => void;
  onSubmit: () => Promise<void>;
  onUpdateDevice: (id: string, updated: DeviceEntry) => void;
  totalBudget: number;
}>) {
  const submitDisabledReason =
    !isFormValid && !isSubmitting
      ? getCustomRequestSubmitDisabledReason(devices)
      : null;

  const submitButton = (
    <Button
      size="md"
      disabled={!isFormValid || isSubmitting}
      onClick={onSubmit}
      data-testid="customrequestform-button"
    >
      {isSubmitting ? "Submitting..." : "Submit Request"}
    </Button>
  );

  return (
    <div className="flex w-full flex-col rounded-xl bg-white shadow-xl">
      <div className="flex items-start justify-between px-6 pt-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Custom Device Request
          </h2>
          <p className="text-sm text-gray-600">
            Add custom device requests with specifications and requirements.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isCloseLoading}
          className="rounded-md p-1 text-gray-500 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto px-6 pb-6 pt-5">
        <div className="flex flex-col gap-4">
          {devices.map((device, index) => (
            <DeviceEntrySection
              key={device.id}
              device={device}
              index={index}
              totalDevices={devices.length}
              assetTypes={assetTypes}
              onChange={(updated) => onUpdateDevice(device.id, updated)}
              onDelete={() => onDeleteDevice(device.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onAddDevice}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <Plus className="size-4" /> Add Another Device
        </button>
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4">
        {totalBudget > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Total Budget
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {totalBudget.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            isLoading={isCloseLoading}
            onClick={onClose}
            data-testid="customrequestform-button-2"
          >
            Cancel
          </Button>
          {submitDisabledReason ? (
            <CustomTooltip
              content={
                <span className="max-w-[240px] text-white text-xs">
                  {submitDisabledReason}
                </span>
              }
            >
              <span className="inline-flex cursor-not-allowed">
                {submitButton}
              </span>
            </CustomTooltip>
          ) : (
            submitButton
          )}
        </div>
      </div>
    </div>
  );
}

export { CustomRequestForm };
