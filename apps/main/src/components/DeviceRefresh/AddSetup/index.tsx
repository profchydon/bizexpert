import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Autocomplete from "@/components/ui/autocomplete";
import AddItemsEmptyInstance from "@/components/Drawers/AddItems/AddItemsEmptyInstance";
import { ICart } from "@/types/cart";
import { IRefreshDevice } from "@/types/refreshDevice";
import useKeyGenerator from "@/hooks/useKeyGenerator";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaveLoading?: boolean;
  addSetupData: ICart[];
  setAddSetupData?: React.Dispatch<React.SetStateAction<ICart[]>>;
  addNote: string | undefined;
  setAddNote?: (value: string) => void | undefined;
}

const AddSetup: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  isSaveLoading = false,
  addSetupData,
  setAddSetupData,
  addNote,
  setAddNote,
}) => {
  const { internalKey, generateKey } = useKeyGenerator();
  const refreshDeviceItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.refreshDeviceItems,
  );

  const equipmentItems = refreshDeviceItems as IRefreshDevice[];
  const equipmentNote = equipmentItems?.[0]?.note as string;

  useEffect(() => {
    const shouldUpdate =
      equipmentItems?.length > 0 &&
      JSON.stringify(equipmentItems) !== JSON.stringify(addSetupData);

    if (shouldUpdate) {
      generateKey();
      // @ts-ignore
      setAddSetupData?.([...equipmentItems]);
    }
  }, [JSON.stringify(equipmentItems)]);

  useEffect(() => {
    if (equipmentNote !== addNote) {
      setAddNote?.(equipmentNote || "");
    }
  }, [equipmentNote]);

  const options = [
    { value: "MI", label: "Microsoft Intune" },
    { value: "ABM", label: "Apple Business Manager" },
  ];

  const updateDeviceSetup = (
    data: ICart[],
    itemId: string,
    deviceSetup: string | null,
  ): ICart[] => {
    return data.map((item) =>
      item.asset?.id === itemId ? { ...item, device_setup: deviceSetup } : item,
    );
  };
  const handleSetUpChange = (itemId: string, deviceSetup: string | null) => {
    setAddSetupData?.((prev) =>
      updateDeviceSetup(prev ?? [], itemId, deviceSetup),
    );
  };

  const getSelectedOptions: any = (deviceSetup: string | null) => {
    if (!deviceSetup) return null;
    return options.find((option) => option.value === deviceSetup) || null;
  };

  const canConfirm =
    addSetupData?.length > 0 &&
    addSetupData.every(
      (item) =>
        typeof item?.device_setup === "string" &&
        item.device_setup.trim() !== "",
    );

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      isSaveButtonDisabled={!canConfirm}
      isSaveLoading={isSaveLoading}
      cancelText="Cancel"
      saveText="Confirm setup"
      drawerDescription={`Configure setup for each item`}
      drawerTitle="Add setup"
      data-testid="addsetup-drawerright"
    >
      <div className="flex flex-col gap-6">
        {addSetupData?.length < 1 && <AddItemsEmptyInstance />}
        {addSetupData?.length > 0 && (
          <div className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-3">
            {addSetupData?.map((item, index) => {
              return (
                <div key={index} className="w-full h-auto px-0 py-0 border-0">
                  <Card
                    className={cn(
                      "bg-white p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                    )}
                  >
                    <CardHeader className="px-4 pt-4 pb-2 flex flex-row items-center gap-3">
                      <Avatar className="h-[3rem] w-[3rem]">
                        <AvatarImage
                          src={item?.images?.[0] ?? ""}
                          alt="product_img"
                          className="rounded-[8px]"
                        />
                        <AvatarFallback className="text-gray-600 bg-gray-100">{`${item?.asset?.name?.[0]}`}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-gray-700 font-medium text-left flex-1">
                        {item?.asset?.name}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <p className="text-sm text-gray-700 font-medium">
                        Custom config request
                      </p>
                      <Autocomplete
                        externalKey={internalKey}
                        options={options}
                        setSelectedOption={(value: any) => {
                          if (!item.asset?.id || !value) return;
                          handleSetUpChange(item?.asset.id, value?.value);
                        }}
                        selectedOption={getSelectedOptions(
                          // @ts-ignore
                          item?.device_setup as string | null,
                        )}
                        isSearchable
                        portalInBody={false}
                        placeholder="Select config. request"
                        data-testid="addsetup-autocomplete"
                      />
                      <p className="text-sm text-gray-600">
                        Custom config request
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {addSetupData?.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Add note</p>
              <Textarea
                className="min-h-[154px]"
                value={addNote}
                placeholder="Enter a additional instructions..."
                onChange={(e) => {
                  setAddNote?.(e.target.value);
                }}
              />
            </div>

            <div className="-mx-6 flex flex-col gap-2 bg-gray-50 p-6 text-black">
              <p className="font-semibold">Note</p>
              <p className="text-sm font-normal">
                Device may need to be unboxed to complete setup
              </p>
            </div>
          </>
        )}
      </div>
    </DrawerRight>
  );
};

export default AddSetup;
