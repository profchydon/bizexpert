import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import AddItemsEmptyInstance from "../AddItems/AddItemsEmptyInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Autocomplete from "@/components/ui/autocomplete";
import { IEquipmentsInStorageByCountry } from "@/types/equipments";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaveLoading?: boolean;
  addSetupData: IEquipmentsInStorageByCountry[];
  setAddSetupData?: (
    value: IEquipmentsInStorageByCountry[],
  ) => void | undefined;
  addNote: string | undefined;
  setAddNote?: (value: string) => void | undefined;
}

const updateDeviceSetup = (
  addSetupData: IEquipmentsInStorageByCountry[],
  itemId: string,
  device_setup: unknown,
): IEquipmentsInStorageByCountry[] => {
  return addSetupData.map((item) => {
    if (item.id === itemId) {
      return { ...item, device_setup };
    }
    return item;
  });
};

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
  const searchParams = useSearchParams();
  const getEmployee_id = searchParams.get("employee_id");

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );

  const getEmployees = employees?.find((item) => item.id === getEmployee_id);
  const employeeItems =
    getEmployees?.items as unknown as IEquipmentsInStorageByCountry[];
  const employeeNote = getEmployees?.note as string;

  useEffect(() => {
    if (employeeItems) {
      return setAddSetupData?.(employeeItems);
    }
    return;
  }, [employeeItems]);

  useEffect(() => {
    if (employeeNote) {
      return setAddNote?.(employeeNote);
    }
    return setAddNote?.("");
  }, [employeeNote]);

  const options = [
    { value: "MI", label: "Microsoft Intune" },
    { value: "ABM", label: "Apple Business Manager" },
  ];

  const handleSetUpChange = (
    addSetupData: IEquipmentsInStorageByCountry[],
    itemId: string,
    device_setup: unknown,
  ) => {
    const updatedAddSetupData = updateDeviceSetup(
      addSetupData,
      itemId,
      device_setup,
    );
    setAddSetupData?.(updatedAddSetupData);
  };

  const getSelectedOptions: any = (deviceSetup: string | null) => {
    if (!deviceSetup) return null;
    return options.find((option) => option.value === deviceSetup) || null;
  };

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      isSaveLoading={isSaveLoading}
      cancelText="Cancel"
      saveText="Confirm setup"
      drawerDescription={`Configure setup for ${getEmployees?.first_name || ""} ${getEmployees?.last_name || ""}`}
      drawerTitle="Add setup"
      data-testid="addsetup-drawerright"
    >
      <div className="flex flex-col gap-6">
        {addSetupData?.length < 1 && <AddItemsEmptyInstance />}
        {addSetupData?.length > 0 && (
          <div className="w-full gap-y-3 px-0 flex flex-col items-start justify-between mt-3">
            {addSetupData?.map((item, index) => {
              return (
                <div key={item.id} className="w-full h-auto px-0 py-0 border-0">
                  <Card
                    className={cn(
                      "bg-white p-0 rounded-xl w-full text-gray-600 cursor-pointer",
                    )}
                  >
                    <CardHeader className="p-4 flex flex-row items-center gap-3">
                      <Avatar className="h-[4rem] w-[4rem]">
                        <AvatarImage
                          src={item.image_url ?? ""}
                          alt="product_img"
                          className="rounded-[8px]"
                        />
                        <AvatarFallback className="text-gray-600 bg-gray-100">{`${item?.title?.[0]}`}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium text-left flex-1">
                        {item.title}
                      </p>
                    </CardHeader>
                    <CardContent className="mt-4 flex flex-col gap-2">
                      <p className="text-sm font-medium">
                        Custom config request
                      </p>
                      <Autocomplete
                        options={options}
                        setSelectedOption={(value: any) => {
                          const selectedValue = value?.value || null;
                          handleSetUpChange(
                            addSetupData,
                            item?.id as string,
                            selectedValue,
                          );
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
