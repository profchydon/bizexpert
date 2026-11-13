import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { countryTimezones } from "../utils/countryTimezones";

export interface LocalTimeBannerProps {
  countryCode?: string;
  countryLabel?: string;
}

export const LocalTimeBanner = ({
  countryCode,
  countryLabel,
}: LocalTimeBannerProps) => {
  const [now, setNow] = useState(() => new Date());

  const timezone = useMemo(() => {
    if (!countryCode) {
      return undefined;
    }

    return countryTimezones[countryCode.toLowerCase()];
  }, [countryCode]);

  useEffect(() => {
    if (!timezone) {
      return;
    }

    const interval = setInterval(() => setNow(new Date()), 60_000);

    return () => clearInterval(interval);
  }, [timezone]);

  if (!timezone) {
    return null;
  }

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(now);

  return (
    <div className="mp-flex mp-items-center mp-gap-3 mp-rounded-xl mp-border mp-border-gray-200 mp-bg-white mp-px-4 mp-py-3">
      <Clock3 className="mp-h-4 mp-w-4 mp-shrink-0 mp-text-gray-500" />
      <p className="mp-text-sm mp-text-gray-600">
        Local time in{" "}
        <span className="mp-font-semibold mp-text-gray-900">
          {countryLabel ?? countryCode?.toUpperCase()}
        </span>
        : {time}
      </p>
    </div>
  );
};
