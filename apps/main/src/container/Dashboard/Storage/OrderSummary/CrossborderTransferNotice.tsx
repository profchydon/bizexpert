import React, { FC } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  showTransferDialog: boolean;
  setShowTransferDialog: (value: boolean) => void;
  handlepay: () => void;
}
const CrossborderTransferNotice: FC<Props> = ({
  showTransferDialog = false,
  setShowTransferDialog,
  handlepay,
}) => {
  return (
    <Dialog
      open={showTransferDialog}
      onOpenChange={setShowTransferDialog}
      data-testid="crossbordertransfernotice-dialog"
    >
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-4 p-2">
          <div className="rounded-full bg-primary-50 p-3">
            <Truck className="w-6 h-6 text-primary-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Cross-Border Transfer Notice
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            By continuing, you agree Rayda will charge customs fees to your
            account (added as a transaction item). Delivery may take longer, and
            supporting documents could be required.
          </p>
          <div className="flex gap-3 w-full mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowTransferDialog(false)}
              data-testid="crossbordertransfernotice-button"
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              className="flex-1 "
              onClick={() => {
                setShowTransferDialog(false);
                handlepay();
              }}
              data-testid="crossbordertransfernotice-button-2"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrossborderTransferNotice;
