import DrawerRight from "@/components/DrawerRight";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IAsset, ISpec } from "@/types/assets";
import React from "react";

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
  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onSave={() => null}
      drawerTitle="Technical specifications"
      drawerDescription="See the specification of the device"
      onCancel={onClose}
      hideDefaultFooterBtn
      data-testid="detaildescription-drawerright"
    >
      <div>
        <h2 className="text-lg font-medium text-gray-700  mb-4">
          {asset?.name} {specs}
        </h2>

        <Separator />

        <div className="my-5 capitalize text-sm">{asset?.name}</div>

        <Separator />

        <div className="my-5 capitalize text-sm">{asset?.make}</div>

        <Separator />

        <div className="my-5 capitalize text-sm">{asset?.model}</div>

        <Separator />

        <div className="my-5 capitalize text-sm">{asset?.category}</div>

        <Separator />

        {spec?.map((spec) => (
          <React.Fragment key={spec?.name}>
            <div className="my-5 capitalize text-sm">{spec?.value}</div>

            <Separator />
          </React.Fragment>
        ))}
      </div>

      <div className="fixed bottom-0 w-full py-4 border-t px-6 bg-white border-gray-200">
        <div className="flex justify-between">
          <div className="grid place-content-end my-auto h-full w-full">
            <div className="flex gap-x-8">
              <Button
                className="text-sm font-semibold"
                variant="outline"
                onClick={onClose}
                data-testid="detaildescription-button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DrawerRight>
  );
};

export default DetailDescription;
