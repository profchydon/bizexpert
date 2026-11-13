import React from "react";
import { SelectItem } from "@/components/ui/select";
import { toAssetTypeOptions, type AssetTypeOption } from "./assetTypeSelect";

interface Props {
  types?: AssetTypeOption[] | null;
}

const EquipmentAssetTypeOptions: React.FC<Props> = ({ types }) => (
  <>
    {toAssetTypeOptions(types).map((type) => (
      <SelectItem key={type.id} value={type.name}>
        {type.name}
      </SelectItem>
    ))}
  </>
);

export default EquipmentAssetTypeOptions;
