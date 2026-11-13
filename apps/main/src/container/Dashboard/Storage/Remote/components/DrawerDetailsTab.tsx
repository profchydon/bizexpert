import type { StorageEquipmentDetailView } from "../types/equipmentDetail";
import { CopyButton } from "./CopyButton";
import { Fact, Section } from "./DrawerPrimitives";

export function DrawerDetailsTab({
  detail,
}: {
  detail: StorageEquipmentDetailView;
}) {
  const { device, specifications } = detail;

  return (
    <div className="flex flex-col gap-5">
      <Section title="Product">
        <Fact label="Type">{device.assetType}</Fact>
        <Fact label="Serial number">
          <span className="flex items-center justify-end gap-1.5 text-sm">
            {device.serialNumber}
            <CopyButton value={device.serialNumber} label="Copy serial" />
          </span>
        </Fact>
      </Section>
      <Section title="Specifications">
        {specifications.length > 0 ? (
          specifications.map((spec) => (
            <Fact key={spec.label} label={spec.label}>
              {spec.value}
            </Fact>
          ))
        ) : (
          <Fact label="Model">{device.model}</Fact>
        )}
      </Section>
    </div>
  );
}
