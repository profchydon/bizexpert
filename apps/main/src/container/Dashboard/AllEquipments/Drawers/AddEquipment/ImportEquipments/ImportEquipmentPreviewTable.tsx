"use client";

import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { getEquipmentTypeIcon } from "@/container/Dashboard/AllEquipments/ViewEquipment/equipmentTypeIcons";
import type { IAddEquipment } from "@/types/equipments";
import { cn } from "@/lib/utils";
import {
  displayImportEquipmentValue,
  formatImportAssetSerial,
  formatImportAssetTypeYear,
  formatImportMakeModel,
} from "./importEquipmentPreviewFormat";
import {
  importEquipmentPreviewActionBodyCellClass,
  importEquipmentPreviewActionHeadCellClass,
  importEquipmentPreviewBodyCellClass,
  importEquipmentPreviewBodyRowClass,
  importEquipmentPreviewHeadCellClass,
  importEquipmentPreviewHeadRowClass,
  importEquipmentPreviewTableClass,
  importEquipmentPreviewTableScrollClass,
  importEquipmentPreviewTableShellClass,
} from "./importEquipmentPreviewTableClasses";

type Props = {
  rows: IAddEquipment[];
  resolveAssigneeName: (assigneeId?: string | null) => string | null;
  onRemove: (equipmentId: string) => void;
  onEdit: (equipmentId: string) => void;
};

const HEADERS = [
  "Asset",
  "Make & model",
  "Asset Type",
  "Assign to",
  "Country",
] as const;

export function ImportEquipmentPreviewTable({
  rows,
  resolveAssigneeName,
  onRemove,
  onEdit,
}: Props) {
  return (
    <div className={importEquipmentPreviewTableScrollClass}>
      <div className={importEquipmentPreviewTableShellClass}>
        <table className={importEquipmentPreviewTableClass}>
          <thead>
            <tr className={importEquipmentPreviewHeadRowClass}>
              {HEADERS.map((header) => (
                <th
                  key={header}
                  className={importEquipmentPreviewHeadCellClass}
                >
                  {header}
                </th>
              ))}
              <th className={importEquipmentPreviewActionHeadCellClass} />
            </tr>
          </thead>
          <tbody>
            {rows.map((equipment) => {
              const assigneeName = equipment.assignee
                ? resolveAssigneeName(String(equipment.assignee))
                : null;
              const TypeIcon = getEquipmentTypeIcon(equipment.type);

              return (
                <tr
                  key={equipment.id}
                  className={cn(
                    importEquipmentPreviewBodyRowClass,
                    !equipment.assignee && "bg-orange-50/60",
                  )}
                >
                  <td
                    className={`max-w-[220px] ${importEquipmentPreviewBodyCellClass}`}
                  >
                    <div className="flex items-center gap-3">
                      {equipment.imageUrl ? (
                        <Avatar
                          size="md"
                          src={equipment.imageUrl}
                          alt={equipment.title ?? "Equipment"}
                        />
                      ) : (
                        <Avatar
                          size="md"
                          initials={equipment.title?.[0]?.toUpperCase()}
                          placeholderIcon={TypeIcon}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-primary">
                          {displayImportEquipmentValue(equipment.title)}
                        </p>
                        <p className="truncate text-sm text-tertiary">
                          {formatImportAssetSerial(
                            equipment.serial_number,
                            equipment.id,
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={importEquipmentPreviewBodyCellClass}>
                    <p
                      className="max-w-[180px] truncate text-sm text-primary sm:max-w-[220px]"
                      title={formatImportMakeModel(
                        equipment.make,
                        equipment.model,
                      )}
                    >
                      {formatImportMakeModel(equipment.make, equipment.model)}
                    </p>
                  </td>
                  <td className={importEquipmentPreviewBodyCellClass}>
                    <p
                      className="max-w-[120px] truncate text-sm text-primary sm:max-w-none sm:whitespace-nowrap"
                      title={formatImportAssetTypeYear(
                        equipment.type,
                        equipment.year,
                      )}
                    >
                      {formatImportAssetTypeYear(
                        equipment.type,
                        equipment.year,
                      )}
                    </p>
                  </td>
                  <td className={importEquipmentPreviewBodyCellClass}>
                    {assigneeName ? (
                      <p
                        className="max-w-[120px] truncate text-sm text-primary"
                        title={assigneeName}
                      >
                        {assigneeName}
                      </p>
                    ) : (
                      <Badge size="sm" color="warning">
                        Unassigned
                      </Badge>
                    )}
                  </td>
                  <td className={importEquipmentPreviewBodyCellClass}>
                    <p
                      className="max-w-[96px] truncate text-sm text-primary sm:max-w-none sm:whitespace-nowrap"
                      title={equipment.country ?? undefined}
                    >
                      {displayImportEquipmentValue(equipment.country)}
                    </p>
                  </td>
                  <td
                    className={cn(
                      importEquipmentPreviewActionBodyCellClass,
                      !equipment.assignee ? "bg-orange-50/60" : "bg-primary",
                    )}
                  >
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap sm:gap-3">
                      <Button
                        size="sm"
                        color="link-gray"
                        onPress={() => onRemove(String(equipment.id))}
                        data-testid="importequipmentpreviewtable-button"
                      >
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        color="link-color"
                        onPress={() => onEdit(String(equipment.id))}
                        data-testid="importequipmentpreviewtable-button-2"
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
