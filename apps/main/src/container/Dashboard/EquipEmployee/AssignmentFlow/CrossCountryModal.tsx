import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CrossBorderPair } from "./crossCountry";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { AlertTriangle } from "lucide-react";

interface CrossCountryModalProps {
  open: boolean;
  pairs: CrossBorderPair[];
  onClose: () => void;
  onProceed: () => void;
  isProceedLoading?: boolean;
}

const CrossCountryModal: React.FC<CrossCountryModalProps> = ({
  open,
  pairs,
  onClose,
  onProceed,
  isProceedLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          return;
        }

        onClose();
      }}
      data-testid="crosscountrymodal-dialog"
    >
      <DialogContent
        className="max-w-md rounded-xl p-0"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-xl">
          <FeaturedIcon icon={AlertTriangle} color="warning" size="lg" />

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">
              International shipping applies
            </h3>
            <p className="text-sm text-gray-600">
              The following devices are being shipped across borders. Customs
              duties and additional international shipping fees will be added to
              your order.
            </p>
          </div>

          <ul className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            {pairs.map((pair) => (
              <li key={pair.unitId} className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-gray-900">
                  {pair.deviceName}
                </p>
                <p className="text-xs text-gray-600">
                  Ships from {pair.deviceCountry} → {pair.employeeName} (
                  {pair.employeeCountry})
                </p>
              </li>
            ))}
          </ul>

          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-testid="crosscountrymodal-button"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              variant="primary"
              className="flex-1"
              onClick={onProceed}
              isLoading={isProceedLoading}
              data-testid="crosscountrymodal-button-2"
            >
              Proceed anyway
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrossCountryModal;
