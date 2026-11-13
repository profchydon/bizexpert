import { DeviceSpecsSummary } from "@/components/application/spec-fields/DeviceSpecsSummary";
import { getAssetTypeLabel } from "@/lib/spec-schema";
import type { SupportedCountry } from "../data/supportedCountries";
import type { ImportCollection, ImportRow } from "../types";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm text-tertiary">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium text-primary">
        {children}
      </span>
    </div>
  );
}

function deviceModel(d: ImportRow): string {
  return (
    d.deviceName.trim() ||
    (typeof d.specs.model_name === "string" && d.specs.model_name.trim()) ||
    "Imported device"
  );
}

interface Props {
  country: SupportedCountry;
  devices: ImportRow[];
  collection: ImportCollection;
}

export function ReviewStep({ country, devices, collection }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-primary">
          Review &amp; submit
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          We&apos;ll arrange collection and let you know when your devices
          arrive.
        </p>
      </div>
      <section className="flex flex-col gap-2.5 rounded-lg border border-secondary p-4">
        <Row label="Destination">
          {country.country} · {country.warehouse}
        </Row>
        <Row label="Devices to import">{devices.length}</Row>
        <Row label="Collection address">{collection.address}</Row>
        <Row label="Contact">
          {collection.contactName} · {collection.contactPhone}
        </Row>
        <Row label="Contact email">{collection.contactEmail || "—"}</Row>
        <Row label="Preferred window">
          {collection.window || "No preference"}
        </Row>
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-tertiary uppercase">
          Devices ({devices.length})
        </h3>
        <div className="flex flex-col gap-2.5">
          {devices.map((d) => (
            <div
              key={d.id}
              className="flex flex-col gap-2 rounded-lg border border-secondary p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-medium text-primary">
                  {deviceModel(d)}
                </span>
                <span className="text-xs text-tertiary">
                  {getAssetTypeLabel(d.assetType) ?? "—"} · {d.serial}
                </span>
              </div>
              <DeviceSpecsSummary
                assetType={d.assetType ?? "other"}
                specs={d.specs}
                extendedSpecs={d.extendedSpecs}
                notes={d.notes}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
