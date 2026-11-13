import { Card, CardContent } from "@/components/ui/card";
import { Check, RefreshCcw } from "lucide-react";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { formatStatus } from "@/utils/formatStatus";

interface Status {
  value: string;
  display: string;
}

interface EstimatedDelivery {
  start_date?: string;
  end_date?: string;
}

interface OrderProgressTimelineProps {
  allStatuses: Status[];
  currentStatus: string;
  estimatedDelivery?: EstimatedDelivery;
  lastUpdated: string;
}

export const OrderProgressTimeline = ({
  allStatuses,
  currentStatus,
  estimatedDelivery,
  lastUpdated,
}: OrderProgressTimelineProps) => {
  const foundIndex = allStatuses.findIndex(
    (status) => status.value === currentStatus,
  );
  const fallbackIndex = allStatuses.length > 0 ? allStatuses.length - 1 : 0;
  const activeIndex = foundIndex >= 0 ? Math.max(foundIndex, 0) : fallbackIndex;

  const formatDeliveryRange = () => {
    if (!estimatedDelivery?.start_date || !estimatedDelivery?.end_date) {
      return null;
    }

    const start = new Date(estimatedDelivery.start_date);
    const end = new Date(estimatedDelivery.end_date);

    if (!isValid(start) || !isValid(end)) {
      return "Delivery date to be confirmed";
    }

    const startFormatted = format(start, "MMM d");
    const endFormatted = format(end, "MMM do yyyy");

    return `${startFormatted} - ${endFormatted}`;
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) {
      return "Recently";
    }
    const date = new Date(lastUpdated);
    if (!isValid(date)) {
      return "Recently";
    }

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return `Today at ${format(date, "h:mm a")}`;
    }

    return format(date, "MMM d 'at' h:mm a");
  };

  return (
    <Card className="bg-primary-700 border-none rounded-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {(() => {
            const deliveryRange = formatDeliveryRange();
            if (!deliveryRange) {
              return null;
            }

            return (
              <div>
                <p className="text-white/70 text-sm">Estimated delivery:</p>
                <p className="text-white text-[20px] leading-[30px] font-medium">
                  {deliveryRange}
                </p>
              </div>
            );
          })()}
          <div className="text-white text-xs flex items-center gap-x-1 ml-auto sm:ml-0">
            <RefreshCcw className="w-3.5 h-3.5" />
            Updated: {formatLastUpdated()}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto pb-1">
          <div className="min-w-[780px] flex items-start">
            {allStatuses.map((status, index) => {
              const completed = index < activeIndex;
              const isActive = index === activeIndex;
              const isLast = index === allStatuses.length - 1;
              let statusIcon = (
                <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              );

              if (completed) {
                statusIcon = (
                  <Check className="h-4 w-4 text-primary-700" strokeWidth={3} />
                );
              }

              if (isActive) {
                statusIcon = (
                  <span className="h-3 w-3 rounded-full bg-primary-600" />
                );
              }

              return (
                <div
                  key={status.value}
                  className={cn(
                    "flex items-start",
                    isLast ? "w-auto" : "flex-1 min-w-[120px]",
                  )}
                >
                  <div className="flex flex-col items-center min-w-[88px]">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        completed && "bg-white",
                        isActive && "ring-4 ring-white/30 bg-white",
                        !completed &&
                          !isActive &&
                          "border-[3px] border-white/60",
                      )}
                    >
                      {statusIcon}
                    </div>

                    <p className="mt-2 text-center text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap">
                      {formatStatus(status.value)}
                    </p>
                  </div>

                  {!isLast && (
                    <div className="pt-[15px] w-full px-1">
                      <div
                        className={cn(
                          "h-[2px] w-full",
                          index < activeIndex ? "bg-white" : "bg-white/35",
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
