"use client";

import { Mail01 } from "@untitledui/icons";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { IEquipment } from "@/types/equipments";
import { useEffect, useState } from "react";
import { viewEquipmentSupportCardClass } from "@/container/Dashboard/AllEquipments/ViewEquipment/viewEquipmentClasses";

interface Props {
  status?: IEquipment["status"];
}

const SupportSection = ({ status }: Props) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className={viewEquipmentSupportCardClass}>
      <BadgeWithDot
        color={isOnline ? "success" : "error"}
        size="sm"
        type="pill-color"
      >
        {isOnline ? "Online" : "Offline"}
      </BadgeWithDot>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-primary">
          Need help with something?
        </p>
        <p className="text-sm text-tertiary">
          Our expert team are ready to help.
        </p>
      </div>
      <a href="mailto:Support@rayda.co" className="w-full">
        <Button
          size="sm"
          color="secondary"
          iconLeading={Mail01}
          className="w-full"
          data-testid="supportsection-button"
        >
          {status?.toLowerCase() !== "unassigned"
            ? "Email support"
            : "Chat to support"}
        </Button>
      </a>
    </div>
  );
};

export default SupportSection;
