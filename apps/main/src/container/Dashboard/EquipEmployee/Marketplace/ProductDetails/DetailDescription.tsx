import DrawerRight from "@/components/DrawerRight";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IAsset, ISpec } from "@/types/assets";
import React from "react";
import { toSpecificationRows } from "./spec-utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asset: IAsset;
  spec: ISpec[];
}
const DetailDescription: React.FC<Props> = ({
  isOpen,
  onClose,
  asset,
  spec,
}) => {
  const specs = spec?.map((sp) => sp.value).join(" ");
  const rows = toSpecificationRows(spec);
  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onSave={() => null}
      drawerTitle="Technical specifications"
      drawerDescription="See the specification of this device configuration"
      onCancel={onClose}
      hideDefaultFooterBtn
      data-testid="detaildescription-drawerright"
    >
      <div className="pb-20">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {asset?.name} {specs}
        </h2>

        <Separator />

        <div className="my-5 text-sm capitalize text-gray-700">
          {asset?.name}
        </div>

        <Separator />

        <div className="my-5 text-sm capitalize text-gray-700">
          {asset?.make}
        </div>

        <Separator />

        <div className="my-5 text-sm capitalize text-gray-700">
          {asset?.model}
        </div>

        <Separator />

        <div className="my-5 text-sm capitalize text-gray-700">
          {asset?.category}
        </div>

        <Separator />

        {rows.map((row) => (
          <React.Fragment key={row.label}>
            <div className="my-4 grid grid-cols-[120px_1fr] gap-3 text-sm">
              <span className="font-medium text-gray-600">{row.label}</span>
              <span className="text-gray-900">{row.value}</span>
            </div>

            <Separator />
          </React.Fragment>
        ))}
      </div>

      <div className="fixed bottom-0 w-full border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex justify-end">
          <Button
            className="text-sm font-semibold"
            variant="outline"
            onClick={onClose}
            data-testid="detaildescription-button"
          >
            Close
          </Button>
        </div>
      </div>
    </DrawerRight>
  );
};

export default DetailDescription;
