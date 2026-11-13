import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/SafeImage";
import formatAmount from "@/utils/formatAmount";
import { IEmployeeRequest, IEmployees } from "@/types/employees";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { Separator } from "@/components/ui/separator";
import { useGetCatalogAssetsQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalogAssets";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import DeclineReason from "./DeclineReason";
import { useRouter } from "next/navigation";
import routes from "@/routes";
import { useAppDispatch } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employeeDetails?: IEmployeeRequest;
}

const ViewEmployeeDetails: React.FC<Props> = ({
  isOpen,
  onClose,
  employeeDetails,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const employee = employeeDetails?.employee;
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const newEmployeeData = {
    ...employee,
    items: employeeDetails?.items,
    requestId: employeeDetails?.id,
  } as IEmployees;

  const [declineReason, setDeclineReason] = useState<IEmployeeRequest>();

  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        drawerTitle={employeeDetails?.catalog.name ?? ""}
        drawerDescription=""
        hideDefaultFooterBtn
        data-testid="viewemployeedetails-drawerright"
      >
        <div className="mb-[78px]">
          <div className="flex flex-col">
            <span className="text-2xl text-black font-semibold">
              {employee?.first_name} {employee?.last_name}
            </span>
            <span className="text-base">
              {employee?.job_title ?? (
                <Badge variant="red">Not available</Badge>
              )}
            </span>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between gap-x-2 pb-6">
            <div className="flex flex-col gap-y-2">
              <span className="text-xs font-medium">Total amount</span>
              <span className="text-sm">
                {employeeDetails?.currency}
                {formatAmount(employeeDetails?.total_amount!)}
              </span>
            </div>

            <div className="flex flex-col gap-y-2">
              <span className="text-xs font-medium">Order status</span>
              {(employeeDetails?.order && (
                <>
                  {employeeDetails?.status === "pending" && (
                    <Badge variant="pending" className="w-fit">
                      Pending
                    </Badge>
                  )}
                  {employeeDetails?.status === "approved" && (
                    <Badge variant="success">Completed</Badge>
                  )}
                </>
              )) ?? <Badge variant="red">Not available</Badge>}
            </div>
          </div>

          <div className="flex flex-col gap-y-2 pb-6">
            <span className="text-xs font-medium">Address</span>
            <span className="text-sm">
              {employee?.address ?? <Badge variant="red">Not available</Badge>}
            </span>
          </div>

          {employeeDetails?.rejection_reason && (
            <div className="flex flex-col gap-y-2 ">
              <span className="text-xs font-medium">Reason for rejection</span>
              <span className="text-sm">
                {employeeDetails?.rejection_reason}
              </span>
            </div>
          )}

          <Separator className="my-6" />

          <div className="flex flex-col">
            <span className="text-sm font-medium">Items</span>
            <span className="text-sm font-normal">
              The following items are included in this order
            </span>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            {employeeDetails?.items?.map((item) => {
              const specs = Object.values(
                JSON.parse(item.specification.properties as unknown as string),
              ).join(" ");
              const asset = item.asset;
              return (
                <div
                  key={item.pricing.id}
                  className="flex items-center gap-x-3 border-b pb-4"
                >
                  {item?.images?.[0] ? (
                    <SafeImage
                      className="w-12 object-cover"
                      src={item.images[0]}
                      alt={asset.name}
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span className="text-gray-400 text-xs w-12 text-center">
                      No image
                    </span>
                  )}
                  <div className="text-xs">
                    <span className="text-sm font-semibold">
                      {asset.name} {specs}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DrawerFooter
          onClose={() => setDeclineReason(employeeDetails)}
          onSubmit={() => {
            dispatch(setSelectedEmployees([newEmployeeData]));
            router.push(
              `${routes.EQUIP_EMPLOYEE_ORDER_SUMMARY}?catalogId=${employeeDetails?.catalog.id}`,
            );
          }}
          disableSubmitButton={employeeDetails?.status === "approved"}
          disableCancelButton={employeeDetails?.status === "approved"}
          cancelText="Decline"
          saveText="Approve"
        />
      </DrawerRight>

      <DeclineReason
        isOpen={Boolean(declineReason)}
        onClose={() => setDeclineReason(undefined)}
        employeeReq={declineReason!}
      />
    </>
  );
};

export default ViewEmployeeDetails;
