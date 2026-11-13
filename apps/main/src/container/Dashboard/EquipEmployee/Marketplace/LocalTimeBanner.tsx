import { Clock3 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { countryTimezones } from "./data/countryTimezones";

interface Props {
  countryCode?: string;
  countryLabel?: string;
  className?: string;
}

const LocalTimeBanner: React.FC<Props> = ({
  countryCode,
  countryLabel,
  className,
}) => {
  const [now, setNow] = useState(() => new Date());

  const timezone = useMemo(() => {
    if (!countryCode) {
      return undefined;
    }

    return (
      countryTimezones[countryCode.toLowerCase()] ??
      countryTimezones[countryCode]
    );
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
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-secondary bg-primary px-4 py-3",
        className,
      )}
    >
      <Clock3 className="size-4 shrink-0 text-tertiary" />
      <p className="text-sm text-secondary">
        Local time in{" "}
        <span className="font-semibold text-primary">
          {countryLabel ?? countryCode?.toUpperCase()}
        </span>
        : {time}
      </p>
    </div>
  );
};

export default LocalTimeBanner;
