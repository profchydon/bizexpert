import React, { useMemo, useState } from "react";

import DrawerRight from "@/components/DrawerRight";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { roundedImage_placeholder } from "@/assets/images";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Offboard_asset } from "@/types/offboarding";
import { useAppDispatch, useAppSelector } from "@/store";
import { useSearchParams } from "next/navigation";
import { updateOffboardingData } from "@/store/slices/offboardingSlice";
import { getInitials } from "@/utils/getInitials";
import truncate from "lodash/truncate";
import PageState from "@/components/PageState";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleChange: () => void;
}

const TransferActionsEdit: React.FC<Props> = ({
  isOpen,
  onClose,
  handleChange,
}) => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const equipID = searchParams.get("equip_id");
  const [collectionStartDate, setCollectionStartDate] = useState<
    Date | string
  >();
  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const singleOffboardingDB = useMemo(() => {
    if (Array.isArray(offboardingData)) {
      const response = offboardingData?.find(
        (item) => item?.id === equipID,
      ) as Offboard_asset;
      setCollectionStartDate(response?.collectionDate as string);
      return response;
    }
    setCollectionStartDate(offboardingData?.collectionDate as string);
    return offboardingData;
  }, [equipID, offboardingData]);

  const handleSave = () => {
    let updatedOffboardingData: Offboard_asset | Offboard_asset[];

    if (Array.isArray(offboardingData)) {
      updatedOffboardingData = offboardingData.map((data) =>
        data.id === equipID
          ? { ...data, collectionDate: collectionStartDate }
          : data,
      );
    } else {
      updatedOffboardingData = {
        ...offboardingData,
        collectionDate: collectionStartDate as string,
      };
    }

    dispatch(updateOffboardingData(updatedOffboardingData));
    onClose();
  };

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        onSave={handleSave}
        saveText={"Save"}
        isSaveButtonDisabled={!collectionStartDate}
        drawerTitle="Edit"
        drawerDescription="Please edit action details"
        data-testid="transferactionsedit-drawerright"
      >
        <PageState isLoading={!singleOffboardingDB} isError={false}>
          <div className="space-y-5 mt-6 px-0">
            <div className="flex flex-col gap-y-1">
              <p className="font-medium text-sm text-gray-700">Item</p>
              <p className="text-sm text-gray-600">
                Here this item is about to be off-board.
              </p>
            </div>
            <Separator />
            <div className="flex flex-row items-center gap-x-3 sm:gap-x-2">
              <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
                <Image
                  src={
                    singleOffboardingDB?.image_url || roundedImage_placeholder
                  }
                  alt={"roundedImage_placeholder"}
                  className="w-full object-fill rounded-full"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-gray-900 font-medium text-sm w-[30ch] truncate">
                  {`${singleOffboardingDB?.title} ${singleOffboardingDB?.make} (${singleOffboardingDB?.year})`}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label>Collection start date</Label>
              <DatePicker
                className="w-full h-[44px]"
                date={collectionStartDate as Date}
                placeHolder="Select a purchase date"
                disablePastDates
                setDate={(value: Date) => {
                  setCollectionStartDate(value);
                }}
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-row items-center gap-x-3 sm:gap-x-6">
                <Avatar className="h-[4rem] w-[4rem] border-2 border-white shadow-md">
                  <AvatarFallback className="text-gray-600 bg-gray-100">
                    {getInitials(`${singleOffboardingDB?.assignee?.name}`)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <p className="text-gray-900 font-semibold text-2xl truncate">
                    {truncate(`${singleOffboardingDB?.assignee?.name || ""}`, {
                      length: 20,
                    })}
                  </p>
                  <p className="text-gray-900 font-medium text-sm truncate">
                    {singleOffboardingDB?.assignee?.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Separator className="w-[110px]" />
                <p className="text-gray-600 font-semibold text-sm">
                  Transferred to
                </p>
                <Separator className="w-[110px]" />
              </div>
              <div className="flex flex-row items-center gap-x-3 sm:gap-x-6 w-full">
                <Avatar className="h-[4rem] w-[4rem] border-2 border-white shadow-md">
                  <AvatarFallback className="text-gray-600 bg-gray-100">
                    {getInitials(
                      `${singleOffboardingDB?.receiver?.first_name} ${singleOffboardingDB?.receiver?.last_name}`,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <p className="text-gray-900 font-semibold text-2xl truncate">
                    {truncate(
                      `${singleOffboardingDB?.receiver?.first_name} ${singleOffboardingDB?.receiver?.last_name}`,
                      { length: 14 },
                    )}
                  </p>
                  <p className="text-gray-900 font-medium text-sm truncate">
                    {truncate(`${singleOffboardingDB?.receiver?.email}`, {
                      length: 20,
                    })}
                  </p>
                </div>
                <button
                  onClick={handleChange}
                  className="text-primary-700 text-sm font-semibold w-[49px]"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </PageState>
      </DrawerRight>
    </div>
  );
};

export default TransferActionsEdit;
