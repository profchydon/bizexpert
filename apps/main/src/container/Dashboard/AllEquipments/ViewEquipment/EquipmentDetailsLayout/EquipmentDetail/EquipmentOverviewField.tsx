import type { ComponentType, ReactNode } from "react";
import { Globe02 } from "@untitledui/icons";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import {
  viewEquipmentDetailFieldIconShellClass,
  viewEquipmentDetailFieldRowClass,
} from "../../viewEquipmentClasses";

export const EquipmentItemWithSymbol = ({
  location,
  value,
  icon: Icon,
}: {
  location?: { country_code: string };
  value: string | ReactNode;
  icon?: ComponentType<{ className?: string }>;
}) => (
  <div className={viewEquipmentDetailFieldRowClass}>
    {location?.country_code ? (
      <div className="size-10 shrink-0 overflow-hidden rounded-full border border-secondary">
        <ReactCountryFlag
          countryCode={location.country_code}
          svg
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
          }}
        />
      </div>
    ) : (
      <div className={viewEquipmentDetailFieldIconShellClass}>
        {Icon ? (
          <Icon className="size-5 text-fg-quaternary" aria-hidden />
        ) : (
          <Globe02 className="size-5 text-fg-quaternary" aria-hidden />
        )}
      </div>
    )}
    <span className="min-w-0 break-words">{value}</span>
  </div>
);

export const EquipmentOverviewItems = ({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) => (
  <div className="min-w-0">
    <p className="text-xs font-medium text-tertiary">{label || ""}</p>
    <p className="text-sm font-medium text-primary">{value}</p>
  </div>
);
