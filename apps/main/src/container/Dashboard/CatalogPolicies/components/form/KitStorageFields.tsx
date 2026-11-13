"use client";

import type { CatalogRule } from "../../types";
import { CompactKitSelectionSection } from "./SelectionFields";
import { StorageOptionFields } from "./FormFields";

export function KitStorageFields({
  rule,
  onChange,
}: {
  rule: CatalogRule;
  onChange: (rule: CatalogRule) => void;
}) {
  return (
    <div className="space-y-5">
      <CompactKitSelectionSection
        selectedKitIds={rule.kitIds}
        onKitsChange={(kitIds) => onChange({ ...rule, kitIds })}
      />
      <StorageOptionFields
        includeStorage={rule.includeCompanyStorage}
        onStorageChange={(includeCompanyStorage) =>
          onChange({ ...rule, includeCompanyStorage })
        }
      />
    </div>
  );
}
