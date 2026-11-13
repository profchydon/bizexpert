import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { NigeriaHoliday } from "../Marketplace/data/nigeriaHolidays";

interface HolidayWarningBannerProps {
  holiday: NigeriaHoliday;
}

const formatDateRange = (holiday: NigeriaHoliday) => {
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };

  if (holiday.durationDays === 1) {
    return holiday.startDate.toLocaleDateString("en-US", opts);
  }

  const start = holiday.startDate.toLocaleDateString("en-US", opts);
  const end = holiday.endDate.toLocaleDateString("en-US", { day: "numeric" });
  return `${start}–${end}`;
};

const HolidayWarningBanner: React.FC<HolidayWarningBannerProps> = ({
  holiday,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const dateRange = formatDateRange(holiday);
  const pluralSuffix = holiday.durationDays > 1 ? "s" : "";
  const delayText = `${holiday.durationDays} day${pluralSuffix}`;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-warning-300 bg-warning-50 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-600" />
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm font-semibold text-warning-700">
          {holiday.name} — {dateRange}
        </p>
        <p className="text-sm text-warning-600">
          Deliveries to Nigeria may be delayed by up to {delayText} due to this
          public holiday.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss holiday warning"
        className="mt-0.5 rounded p-1 text-warning-600 transition-colors hover:bg-warning-100"
      >
        <X className="h-4 w-4 shrink-0" />
      </button>
    </div>
  );
};

export default HolidayWarningBanner;
