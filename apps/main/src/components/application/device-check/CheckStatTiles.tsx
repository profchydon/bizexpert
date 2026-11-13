import type { FC } from "react";
import { Package, Power01 } from "@untitledui/icons";
import type { AccessoryItem } from "./types";

interface Props {
  powersOn: boolean | null;
  accessories: AccessoryItem[];
}

export function CheckStatTiles({ powersOn, accessories }: Props) {
  const present = accessories.filter((a) => a.present).length;
  const tiles: {
    icon: FC<{ className?: string }>;
    value: string;
    label: string;
  }[] = [];
  if (powersOn != null)
    tiles.push({
      icon: Power01,
      value: powersOn ? "Yes" : "No",
      label: "Powers on",
    });
  tiles.push({ icon: Package, value: `${present}`, label: "Accessories" });

  return (
    <div className="flex gap-2">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <div
            key={t.label}
            className="flex flex-1 flex-col gap-1 rounded-lg border border-secondary bg-primary p-3"
          >
            <Icon className="size-4 text-fg-quaternary" />
            <span className="text-sm font-semibold text-primary">
              {t.value}
            </span>
            <span className="text-xs text-tertiary">{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
