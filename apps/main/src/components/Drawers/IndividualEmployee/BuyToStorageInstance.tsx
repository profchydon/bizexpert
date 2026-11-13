import { ISubOrder } from "@/types/orders";
import React, { FC } from "react";
import Image from "next/image";
import Image_wrap from "@/assets/images/Image_wrap.png";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";
import { Badge } from "@/components/ui/badge";
import { OrderFlowType, orderFlowTypeCheck } from "@/types/offboarding";

import truncate from "lodash/truncate";
import dayjs from "dayjs";
import { OrderNoteActivity } from "./OrderNoteActivity";
import { SafeImage } from "@/components/SafeImage";

interface Props {
  subOrderDetail?: ISubOrder;
  currency: string;
  focusedNoteIndex?: number | null;
}
const BuyToStorageInstance: FC<Props> = ({
  subOrderDetail,
  currency,
  focusedNoteIndex,
}) => {
  const orderStatus =
    subOrderDetail?.status?.toLocaleLowerCase() as ASSET_ORDER_STATUS;
  const actionType = subOrderDetail?.type as OrderFlowType;

  return (
    <>
      <div className="flex flex-col items-center flex-grow mb-24">
        <div className="absolute w-full size-fit right-0 left-0 top-[60px] ">
          <Image
            src={Image_wrap}
            alt="Order header background"
            className="w-full"
            sizes="100vw"
            priority
          />
          <div className="absolute top-[80px] pt-5 pl-6">
            <div className="rounded-full w-[60px] flex flex-col justify-center items-center h-[60px] bg-gray-100">
              <SafeImage
                src={subOrderDetail?.equipment?.image_url}
                alt="Equipment image"
                className="w-full object-fill rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-16 pb-6 border-b border-gray-200 space-y-2">
        <p className="text-gray-900 font-medium text-lg w-[30ch] truncate">
          {truncate(
            `${subOrderDetail?.equipment?.title} ${subOrderDetail?.equipment?.make} (${subOrderDetail?.equipment?.year})`,
            {
              length: 30,
            },
          )}
        </p>
      </div>
      <div className="flex flex-col flex-grow overflow-auto">
        <div className="flex flex-col border-b pb-6 my-4">
          <span className="text-sm font-medium">Order status</span>
          {orderStatusMap?.[orderStatus]?.label && (
            <div className="w-fit">
              <Badge
                className={orderStatusMap?.[orderStatus]?.className}
                variant={orderStatusMap?.[orderStatus]?.variant as any}
              >
                {orderStatusMap?.[orderStatus]?.label}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col border-b pb-6 mb-4">
          <span className="text-sm font-medium">Tracking number</span>
          {(subOrderDetail as any)?.tracking_no ? (
            <a
              href={`/track/${(subOrderDetail as any)?.tracking_no}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer transition-colors"
            >
              {(subOrderDetail as any)?.tracking_no}
            </a>
          ) : (
            <Badge variant="red">Not available</Badge>
          )}
        </div>
        <div className="flex flex-col border-b pb-6 mb-4">
          <span className="text-sm medium">Collection start date</span>
          <span className="text-sm font-medium">
            {subOrderDetail?.collection_date ? (
              dayjs(subOrderDetail?.collection_date).format("MMM DD, YYYY")
            ) : (
              <Badge variant="red">Not available</Badge>
            )}
          </span>
        </div>
        <div className="flex flex-col border-b pb-6 mb-4">
          <span className="text-sm medium">Action type</span>
          {orderFlowTypeCheck[actionType]?.label && (
            <div className="w-fit">
              <Badge
                className={orderFlowTypeCheck[actionType]?.className}
                variant={orderFlowTypeCheck[actionType]?.variant as any}
              >
                {orderFlowTypeCheck[actionType]?.label}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col border-b pb-6 mb-4">
          <span className="text-sm medium">Duration</span>
          {subOrderDetail?.storage_duration ? (
            <span className="text-sm font-medium">
              {subOrderDetail?.storage_duration}{" "}
            </span>
          ) : (
            <Badge variant="red">Not available</Badge>
          )}
        </div>

        <div className="flex flex-col border-b pb-6 mb-4">
          <span className="text-sm medium">Location</span>
          {(subOrderDetail as any)?.storage_location ? (
            <span className="text-sm font-medium">
              {(subOrderDetail as any)?.storage_location}{" "}
            </span>
          ) : (
            <Badge variant="red">Not available</Badge>
          )}
        </div>

        {(subOrderDetail as any)?.note?.length > 0 && (
          <OrderNoteActivity
            notes={(subOrderDetail as any)?.note}
            focusedNoteIndex={focusedNoteIndex}
          />
        )}
      </div>
    </>
  );
};

export default BuyToStorageInstance;
