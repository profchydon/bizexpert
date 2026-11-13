import { Button } from "@/components/ui/button";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { Copy, RefreshCcw } from "lucide-react";

interface OrderHeaderProps {
  orderId: string;
  trackingLink?: string;
  onRefresh?: () => void;
}

export const OrderHeader = ({
  orderId,
  trackingLink,
  onRefresh,
}: OrderHeaderProps) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      globalThis.location.reload();
    }
  };

  const handleCopy = async () => {
    if (!trackingLink) return;

    try {
      await navigator.clipboard.writeText(trackingLink);
      displaySuccessMessage("Tracking link copied successfully");
    } catch {
      displayErrorMessage("Failed to copy tracking link");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm text-gray-500">Order number:</p>
        <p className="font-medium text-[28px] leading-[36px] sm:text-[38px] sm:leading-[44px] tracking-tight break-all text-gray-900">
          {orderId}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-x-2 w-full sm:w-auto sm:pt-2">
        <Button
          variant="outline"
          size="md"
          onClick={handleCopy}
          className="h-10 text-sm font-semibold w-full sm:w-auto justify-center border-gray-300 text-gray-700 hover:bg-gray-50"
          data-testid="orderheader-button"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy tracking link
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={handleRefresh}
          className="h-10 text-primary-600 text-sm font-semibold w-full sm:w-auto justify-center border-primary-300 hover:bg-primary-25"
          data-testid="orderheader-button-2"
        >
          <RefreshCcw className="h-4 w-4 mr-2 text-primary-600" />
          Refresh status
        </Button>
      </div>
    </div>
  );
};
