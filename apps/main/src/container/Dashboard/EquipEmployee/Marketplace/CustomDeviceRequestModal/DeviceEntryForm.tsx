import type { IAssetCategory } from "@/types/assets";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DeviceSpecificationFields } from "./DeviceSpecificationFields";
import type { DeviceEntry } from "./types";

function DeviceEntryForm({
  device,
  assetTypes,
  onChange,
}: Readonly<{
  device: DeviceEntry;
  assetTypes: IAssetCategory[];
  onChange: (updated: DeviceEntry) => void;
}>) {
  const deviceNameId = `custom-device-name-${device.id}`;
  const assetTypeId = `custom-asset-type-${device.id}`;
  const quantityId = `custom-quantity-${device.id}`;
  const budgetId = `custom-budget-${device.id}`;
  const descriptionId = `custom-description-${device.id}`;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={deviceNameId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Device Name <span className="text-red-500">*</span>
          </label>
          <Input
            id={deviceNameId}
            placeholder="e.g., MacBook Pro M3"
            value={device.deviceName}
            onChange={(event) =>
              onChange({ ...device, deviceName: event.target.value })
            }
            data-testid="deviceentryform-input"
          />
        </div>

        <div>
          <label
            htmlFor={assetTypeId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Asset Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={device.assetType}
            onValueChange={(value) => onChange({ ...device, assetType: value })}
            data-testid="deviceentryform-select"
          >
            <SelectTrigger id={assetTypeId}>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map((assetType) => (
                <SelectItem key={assetType.id} value={assetType.name}>
                  {assetType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={quantityId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            id={quantityId}
            placeholder="e.g., 5"
            inputMode="numeric"
            value={device.quantity}
            onChange={(event) =>
              onChange({
                ...device,
                quantity: event.target.value.replaceAll(/\D/g, ""),
              })
            }
            data-testid="deviceentryform-input-2"
          />
        </div>

        <div>
          <label
            htmlFor={budgetId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Budget
          </label>
          <Input
            id={budgetId}
            placeholder="e.g., 2500"
            inputMode="numeric"
            value={device.budgetPrice}
            onChange={(event) =>
              onChange({
                ...device,
                budgetPrice: event.target.value.replaceAll(/\D/g, ""),
              })
            }
            data-testid="deviceentryform-input-3"
          />
        </div>
      </div>

      <DeviceSpecificationFields
        rows={device.extendedSpecs}
        onChange={(extendedSpecs) => onChange({ ...device, extendedSpecs })}
      />

      <div className="border-t border-gray-200 pt-5">
        <label
          htmlFor={descriptionId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          id={descriptionId}
          placeholder="Describe the device specifications and requirements..."
          rows={3}
          value={device.description}
          onChange={(event) =>
            onChange({ ...device, description: event.target.value })
          }
        />
      </div>
    </>
  );
}

export { DeviceEntryForm };
