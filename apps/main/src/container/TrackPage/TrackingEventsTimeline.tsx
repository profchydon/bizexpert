import { Check, X } from "lucide-react";

interface TrackingEvent {
  event: string;
  note?: string;
  date: string;
  status: string;
}

interface TrackingEventsTimelineProps {
  events: TrackingEvent[];
}

export const TrackingEventsTimeline = ({
  events,
}: TrackingEventsTimelineProps) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const pendingIndex = sortedEvents.findIndex(
    (event) =>
      event.status?.toLowerCase() === "order_delivered" &&
      String(event.note || "")
        .toLowerCase()
        .includes("estimated delivery"),
  );
  const activeIndex = pendingIndex === 0 ? 1 : 0;

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${formattedHours}:${minutes}${ampm} ${day} ${month} ${year}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-2 sm:p-4">
      <p className="font-normal text-gray-400 text-xs sm:text-sm uppercase tracking-wide">
        Route details:
      </p>
      {sortedEvents.map((event, index) => {
        const isLast = index === sortedEvents.length - 1;
        const isActive = index === activeIndex;
        const isCancelled = event.status === "order_cancelled";
        const isPending = index === pendingIndex;
        let markerContent = (
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
        );
        let titleClass = "text-gray-900";

        if (isPending) {
          markerContent = (
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          );
          titleClass = "text-gray-700";
        }

        if (isCancelled) {
          markerContent = (
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
          );
          titleClass = "text-error-600";
        }

        return (
          <div
            key={`${event.status}-${event.date}-${event.event}`}
            className="relative flex gap-3 sm:gap-4"
          >
            {!isLast && (
              <div className="absolute left-[11px] sm:left-[13px] top-[28px] h-10 sm:h-16 w-[2px] bg-gray-200" />
            )}
            <div className="relative flex-shrink-0">
              <div
                className={`
                    w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all
                    ${isPending ? "bg-gray-100 border border-gray-200" : ""}
                    ${!isPending && isCancelled && (isActive ? "bg-error-600 ring-4 ring-error-100" : "bg-error-600")}
                    ${!isPending && !isCancelled && (isActive ? "bg-primary-600 ring-4 ring-primary-100" : "bg-primary-600")}
                  `}
              >
                {markerContent}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1 pt-0.5 min-w-0">
              <div className="flex-1 flex items-start justify-between gap-2">
                <div>
                  <h3
                    className={`
                        font-semibold text-sm sm:text-base mb-1
                        ${titleClass}
                      `}
                  >
                    {event.event}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">
                    {event.note || "No additional details"}
                  </p>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap pt-0.5">
                  {formatTimestamp(event.date)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
