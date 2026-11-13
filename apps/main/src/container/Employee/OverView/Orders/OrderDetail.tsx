import DrawerRight from "@/components/DrawerRight";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CircleCheck } from "lucide-react";
import React from "react";
import { SafeImage } from "@/components/SafeImage";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import { useGetEmployeeOrderDetailQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeOrderDetail";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orderDetail?: IOrder;
}
const OrderDetail: React.FC<Props> = ({ isOpen, onClose, orderDetail }) => {
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();

  const {
    data: orderRes,
    isLoading,
    isError,
    isFetching,
  } = useGetEmployeeOrderDetailQuery(
    {
      companyId: company?.id!,
      employeeId: user?.id!,
      orderId: orderDetail?.id!,
    },
    { skip: !orderDetail },
  );

  const order = orderRes?.data;

  return (
    <DrawerRight
      isOpen={isOpen}
      onCancel={onClose}
      onClose={onClose}
      onSave={() => null}
      drawerTitle={orderDetail?.order_number!}
      drawerDescription={dayjs(orderDetail?.order_date!).format("MMM DD, YYYY")}
      hideSaveButton
      data-testid="orderdetail-drawerright"
    >
      <PageState isError={isError} isLoading={isLoading || isFetching}>
        <div className="mb-[70px]">
          <div className="grid grid-cols-2 gap-6 items-center">
            <div className="flex flex-col gap-y-1">
              <Label className="text-sm font-medium">Budget count</Label>
              <span>
                <Badge
                  className="!border !border-primary-600 bg-white"
                  variant={"blue"}
                >
                  {order?.budget_count ?? (
                    <Badge variant="red">Not available</Badge>
                  )}
                </Badge>
              </span>
            </div>

            <div className="flex flex-col gap-y-1">
              <Label className="text-sm font-medium">Order status</Label>
              <span>
                {order?.status !== "in_progress" && (
                  <Badge className="!text-xs" variant={"success"}>
                    <CircleCheck className="h-4" /> Confirmed
                  </Badge>
                )}
                {order?.status === "in_progress" && (
                  <Badge className="!text-xs" variant={"pending"}>
                    Pending
                  </Badge>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-y-1">
              <Label className="text-sm font-medium">Pickup status</Label>
              <span className="text-sm">
                {order?.pick_up_status ? (
                  <Badge className="!text-xs" variant={"success"}>
                    {order?.pick_up_status}
                  </Badge>
                ) : (
                  <Badge variant="red">Not available</Badge>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-y-1">
              <Label className="text-sm font-medium">Delivery status</Label>
              <span className="text-sm">
                {order?.delivery_status ? (
                  <Badge className="!text-xs" variant={"success"}>
                    {order?.delivery_status}
                  </Badge>
                ) : (
                  <Badge variant="red">Not available</Badge>
                )}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <div>
              <h2 className="text-sm text-gray-900 font-semibold">Items</h2>
              <span className="text-sm">
                The following items are included in this order.
              </span>
            </div>

            <Separator className="my-3" />

            <div className="flex flex-col gap-y-5">
              {order?.items.map((data) => (
                <div key={data.id}>
                  <div className="flex gap-x-2 items-center mb-3">
                    <div className="w-10 h-10">
                      <SafeImage
                        src={data?.images?.[0]}
                        alt={data.description ?? "Order item"}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="truncate text-sm font-semibold text-gray-700 w-[30ch]">
                        {data.description}
                      </p>
                      <div>
                        {data.status === "Available" && (
                          <Badge variant={"success"} className="text-xs w-fit">
                            {data.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator className="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageState>
    </DrawerRight>
  );
};

export default OrderDetail;
