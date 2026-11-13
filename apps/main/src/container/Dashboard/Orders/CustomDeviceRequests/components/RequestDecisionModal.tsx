import type { Dispatch, SetStateAction } from "react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CustomDeviceRequest } from "../types";
import { formatCurrency } from "../utils";
import { CheckCircleIcon } from "lucide-react";
import { RequestDecisionDeviceRow } from "./RequestDecisionDeviceRow";

interface RequestDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting?: boolean;
  request: CustomDeviceRequest;
  selectedDevices: Set<number>;
  setSelectedDevices: Dispatch<SetStateAction<Set<number>>>;
}

export default function RequestDecisionModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  request,
  selectedDevices,
  setSelectedDevices,
}: Readonly<RequestDecisionModalProps>) {
  const currency = request.currency;
  const hideDeviceSelection = request.hideDeviceSelection === true;

  const selectedTotal = request.devices.reduce((sum, device, index) => {
    if (!selectedDevices.has(index)) return sum;

    if (
      device.vendorResponse?.type === "quoted" &&
      device.vendorResponse.quotedPrice
    ) {
      return sum + device.vendorResponse.quotedPrice * device.quantity;
    }

    if (
      device.vendorResponse?.type === "alternative" &&
      device.vendorResponse.alternative
    ) {
      return sum + device.vendorResponse.alternative.price * device.quantity;
    }

    return sum;
  }, 0);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
      data-testid="requestdecisionmodal-dialog"
    >
      <DialogContent
        showCloseButton={!isSubmitting}
        onPointerDownOutside={(event) => {
          if (isSubmitting) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (isSubmitting) {
            event.preventDefault();
          }
        }}
        overlayClassName="z-[1011]"
        className="z-[1012] max-w-lg"
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            <FeaturedIcon
              icon={CheckCircleIcon}
              color="success"
              theme="light"
              size="lg"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-primary">
                Confirm your order
              </h3>
              <p className="text-sm text-tertiary">
                Select the items you want to proceed with. Uncheck any items you
                don&apos;t want to include.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex max-h-[300px] flex-col divide-y divide-gray-200 overflow-y-auto rounded-lg border border-gray-200">
          {request.devices.map((device, index) => (
            <RequestDecisionDeviceRow
              key={`${device.name}-${index}`}
              currency={currency}
              device={device}
              index={index}
              hideSelection={hideDeviceSelection}
              selectedDevices={selectedDevices}
              setSelectedDevices={setSelectedDevices}
            />
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-sm font-medium text-gray-500">
            Order Total ({selectedDevices.size} item
            {selectedDevices.size === 1 ? "" : "s"})
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(selectedTotal, currency)}
          </span>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            data-testid="requestdecisionmodal-button"
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={selectedDevices.size === 0 || isSubmitting}
            data-testid="requestdecisionmodal-button-2"
            className="w-full"
          >
            {isSubmitting ? "Confirming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
