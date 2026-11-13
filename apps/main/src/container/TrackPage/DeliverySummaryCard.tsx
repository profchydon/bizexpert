import { Button } from "@/components/ui/button";
import { formatStatus } from "@/utils/formatStatus";
import { MapPin, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliverySummaryProps {
  statusDisplay?: string;
  estimatedDelivery?: {
    start_date?: string;
    end_date?: string;
  };
  destination?: {
    country?: string;
    address?: string;
  };
  currentLocation?: string;
}

export const DeliverySummaryCard = ({
  statusDisplay,
  estimatedDelivery,
  destination,
  currentLocation,
}: DeliverySummaryProps) => {
  return (
    <div className="p-2 sm:p-4 space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
        <p className="font-semibold text-[24px] leading-[32px] text-gray-900">
          Tracking Information
        </p>

        <div className="flex flex-col items-center sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="h-10 flex flex-row items-center gap-x-2 leading-none text-sm font-semibold text-primary-600 border-primary-300 hover:bg-primary-25 w-full sm:w-auto"
            data-testid="deliverysummarycard-button"
          >
            <a
              href="tel:+2349135272243"
              className="flex flex-row items-center gap-x-2 leading-none"
            >
              <Phone className="w-4 h-4 text-primary-600" />
              <span>Call support</span>
            </a>
          </Button>

          <Button
            variant="outline"
            className="h-10 flex items-center text-sm font-semibold text-primary-600 border-primary-300 hover:bg-primary-25 w-full sm:w-auto"
            data-testid="deliverysummarycard-button-2"
          >
            <a
              href="mailto:abisoye.fadare@rayda.co"
              className="flex flex-row items-center gap-x-2 leading-none"
            >
              <Mail className="w-4 h-4 text-primary-600" />
              <span>Message support</span>
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-normal text-gray-500 text-xs sm:text-sm uppercase tracking-wide">
          Status:
        </p>
        <p
          className={cn(
            "text-[24px] leading-[32px] font-normal",
            statusDisplay?.includes("order_cancelled")
              ? "text-error-600"
              : "text-primary-600",
          )}
        >
          {formatStatus(statusDisplay ?? "")}
        </p>
        <p className="flex flex-row items-start sm:items-center text-primary font-medium gap-x-2 text-sm">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
          <span className="break-words">{currentLocation}</span>
        </p>
      </div>

      {destination?.address && (
        <div className="space-y-2">
          <p className="font-normal text-muted-foreground text-gray-500 text-xs sm:text-sm uppercase tracking-wide">
            Destination:
          </p>
          <p className="flex flex-row items-start sm:items-center text-primary font-medium gap-x-2 text-sm">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
            <span className="break-words">
              {destination.address}, {destination.country}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
