"use client";

import { Trash } from "lucide-react";
import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import { product_1 } from "@/assets/images";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import useCart from "@/hooks/useCart";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useMakeARequestMutation } from "@/api/baseQueries/companiesApi/employeesApi/makeARequest";
import { ICatalog } from "@/types/catalog";
import { useGetEmployeeDashboardQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeDashboard";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { handleUnexpectedAsyncError } from "@/utils/handleUnexpectedAsyncError";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import formatAmount from "@/utils/formatAmount";
import routes from "@/routes";
import { extractOrderIdFromResponse } from "@/lib/orderFlowAnalytics";
import { trackEmployeeOrderSubmitted } from "@/lib/employeePortalAnalytics";
import { useRouter } from "next/navigation";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  budgetLimitPercentage: number;
  budgetLimit: string;
  catalog: ICatalog;
}

const EmployeeCartOverview: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  budgetLimitPercentage,
  budgetLimit,
  catalog,
}) => {
  const { carts, removeItemFromCart, removeAllItemsFromCart, totalAmount } =
    useCart();
  const router = useRouter();
  const { getUserDetails } = useAuthUserDetail();
  const companyId = useWorkspaceCompanyId();
  const user = getUserDetails();
  const currencySymbol = useWorkspaceCurrencySymbol();

  const { data: dashboardRes } = useGetEmployeeDashboardQuery({
    companyId: companyId!,
    employeeId: user?.id!,
  });

  const department_id = dashboardRes?.data?.departments?.[0]?.id!;

  const [makeRequest, makeRequestProps] = useMakeARequestMutation();

  const cartItems = carts;

  function calculatePercentage(value: number) {
    return (value / Number(budgetLimit)) * 100;
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        catalog_id: catalog.id,
        companyId: companyId!,
        currency_id: dashboardRes?.data.company_currency_id!,
        department_id,
        employeeId: user?.id!,
        items: cartItems.map((item) => ({
          quantity: item.quantity,
          amount: Number(item.amount),
          asset_pricing_id: item.pricing.id,
        })),
      };
      const res = await makeRequest(payload);
      const success = res?.data?.success;
      if (success) {
        trackEmployeeOrderSubmitted({
          order_id: extractOrderIdFromResponse(res),
          item_count: cartItems.reduce(
            (count, item) => count + item.quantity,
            0,
          ),
          total_value: totalAmount ?? 0,
        });

        const successMessage = catalog?.config?.auto_approve
          ? "Your request has been approved successfully."
          : "Request placed successfully, awaiting admin approval.";

        displaySuccessMessage(successMessage);
        onClose();
        router.push(routes.EMPLOYEE_ORDERS);
        removeAllItemsFromCart();
      }
    } catch (error) {
      handleUnexpectedAsyncError(error, "Unable to submit request");
    }
  };

  useEffect(() => {
    if (carts?.length === 0) {
      onClose();
    }
  }, [carts?.length]);

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      drawerDescription=""
      drawerTitle="Items summary"
      hideDefaultFooterBtn
      data-testid="employeecartoverview-drawerright"
    >
      <div className="mb-76px">
        <div className="absolute w-full flex flex-row justify-between pb-2 top-[50px] border-b shadow-none bg-white py-1 right-0 left-0">
          <div className="pl-6 ">
            <span className="font-semibold text-sm w-14 h-4 bg-primary-100 rounded-lg px-2 py-1">
              {cartItems.length} item(s)
            </span>
          </div>
          <div className="pr-5 ">
            <span className="font-semibold text-xl text-error-500">
              {catalog.type === "budget"
                ? `${currencySymbol}${formatAmount(String(totalAmount ?? 0))}`
                : `${budgetLimitPercentage.toFixed(2)}%`}
            </span>
          </div>
        </div>

        <div className=" space-y-3 flex flex-col flex-grow overflow-auto mt-6">
          {cartItems.map((item) => {
            const getProps =
              item.specification.properties
                .map((prop) => prop.value)
                .join(" ")
                .slice(0, 29) +
              (item.specification.properties.map((prop) => prop.value).join(" ")
                .length > 29
                ? "..."
                : "");
            return (
              <div
                key={item.pricing.id}
                className="border-b py-6 flex flex-row items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={(item?.images?.[0] as string) || product_1}
                      alt="asset_image"
                    />
                  </Avatar>

                  <p
                    className="text-sm text-black font-semibold line-clamp-2"
                    title={`${item?.asset.name} ${getProps}`}
                  >
                    {item?.asset.name} {getProps}
                  </p>
                </div>

                <div className="sm:text-sm md:text-base flex flex-col items-end justify-between space-y-1">
                  <Trash
                    className="text-gray-500 cursor-pointer font-sm w-[16px] mb-2 justify-end"
                    onClick={() => removeItemFromCart(item.pricing.id)}
                  />
                  <span className="text-xs md:text-sm text-gray-600 font-normal">
                    {catalog.type === "budget"
                      ? `${currencySymbol}${formatAmount(String(item.pricing.amount ?? 0))}`
                      : `${calculatePercentage(Number(item.pricing.amount)).toFixed(2)}%`}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-medium">
              {catalog.type === "budget" ? "Total" : "Total budget percentage"}{" "}
              {catalog.type === "budget" && <InclusivePriceNote />}
            </span>
            <span className="text-error-600">
              {catalog.type === "budget"
                ? `${currencySymbol}${formatAmount(String(totalAmount ?? 0))}`
                : `${budgetLimitPercentage.toFixed(2)}%`}
            </span>
          </div>
        </div>

        <DrawerFooter
          saveText="Checkout"
          onClose={onClose}
          submitButtonType="button"
          onSubmit={handleSubmit}
          disableSubmitButton={makeRequestProps.isLoading}
        />
      </div>
    </DrawerRight>
  );
};

export default EmployeeCartOverview;
