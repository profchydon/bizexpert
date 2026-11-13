"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash01 } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import { ExtendedSpecsList } from "@/components/application/spec-fields/ExtendedSpecsList";
import { SpecFieldsRenderer } from "@/components/application/spec-fields/SpecFieldsRenderer";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import {
  getPeripheralSubtypeForAssetType,
  getSchemaIdForAssetType,
  resetSpecsOnAssetTypeChange,
} from "@/lib/spec-schema";
import { cx } from "@/utils/cx";
import { ASSET_TYPE_ICONS, IMPORT_ASSET_TYPES } from "../data/assetTypes";
import type { ImportRow } from "../types";

interface Props {
  device: ImportRow;
  errors?: string[];
  defaultOpen?: boolean;
  onChange: (updated: ImportRow) => void;
  onRemove: () => void;
}

export function ImportDeviceCard({
  device,
  errors,
  defaultOpen,
  onChange,
  onRemove,
}: Props) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  const schemaId = getSchemaIdForAssetType(device.assetType);
  const Icon = device.assetType
    ? ASSET_TYPE_ICONS[device.assetType]
    : undefined;
  const serialInvalid = !!errors?.some(
    (e) => e.includes("Serial") || e.includes("Duplicate"),
  );

  const changeAssetType = (assetType: string) =>
    onChange({
      ...device,
      assetType,
      specs: resetSpecsOnAssetTypeChange(
        device.specs,
        schemaId,
        getSchemaIdForAssetType(assetType),
      ),
    });

  return (
    <div className="flex flex-col rounded-xl border border-secondary">
      <div className="flex items-center gap-2 p-3">
        <AriaButton
          onPress={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left outline-hidden"
        >
          {open ? (
            <ChevronDown className="size-4 shrink-0 text-quaternary" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-quaternary" />
          )}
          {Icon && <Icon className="size-5 shrink-0 text-fg-quaternary" />}
          <span className="text-sm font-medium text-primary">
            {device.deviceName || "New device"}
          </span>
          {device.serial && (
            <span className="truncate text-xs text-tertiary">
              · {device.serial}
            </span>
          )}
          {errors?.length ? (
            <span className="ml-1 size-1.5 shrink-0 rounded-full bg-utility-error-500" />
          ) : null}
        </AriaButton>
        <Button
          size="sm"
          color="tertiary"
          iconLeading={Trash01}
          onClick={onRemove}
          aria-label="Remove device"
          data-testid="importdevicecard-button"
        />
      </div>
      {open && (
        <div className="flex flex-col gap-4 border-t border-secondary p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Device name"
              placeholder="e.g. MacBook Pro 14"
              size="sm"
              isRequired
              value={device.deviceName}
              onChange={(v) => onChange({ ...device, deviceName: v })}
              isInvalid={!!errors?.includes("Device name required")}
              data-testid="importdevicecard-input"
            />
            <Select
              label="Asset type"
              placeholder="Select asset type"
              size="sm"
              isRequired
              items={IMPORT_ASSET_TYPES}
              selectedKey={device.assetType}
              onSelectionChange={(k) => changeAssetType(String(k))}
              data-testid="importdevicecard-select"
            >
              {(i) => <Select.Item id={i.id}>{i.label}</Select.Item>}
            </Select>
          </div>
          <Input
            label="Serial number"
            placeholder="e.g. C02ABC123"
            size="sm"
            isRequired
            value={device.serial}
            onChange={(v) => onChange({ ...device, serial: v })}
            isInvalid={serialInvalid}
            data-testid="importdevicecard-input-2"
          />
          {device.assetType ? (
            <SpecFieldsRenderer
              schemaId={schemaId}
              values={device.specs}
              onChange={(specs) => onChange({ ...device, specs })}
              mode="rfq"
              forcedSubtype={getPeripheralSubtypeForAssetType(device.assetType)}
              showAddPicker
            />
          ) : (
            <p className="rounded-lg border border-dashed border-secondary p-3 text-sm text-tertiary">
              Pick an asset type to fill in its spec sheet.
            </p>
          )}
          <div className="border-t border-secondary pt-4">
            <ExtendedSpecsList
              rows={device.extendedSpecs}
              onChange={(extendedSpecs) =>
                onChange({ ...device, extendedSpecs })
              }
            />
          </div>
          <TextArea
            label="Notes"
            placeholder="Anything the warehouse should know (optional)"
            rows={2}
            value={device.notes ?? ""}
            onChange={(v) => onChange({ ...device, notes: v })}
          />
          {errors?.length ? (
            <p className="text-xs text-error-primary">{errors.join(" · ")}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
