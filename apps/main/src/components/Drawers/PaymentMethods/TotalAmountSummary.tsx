import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { useGetServiceFeesQuery } from "@/api/baseQueries/feesApi/getServiceFees";
import useCart from "@/hooks/useCart";
import { useAppSelector } from "@/store";
import { IEmployees } from "@/types/employees";
import formatAmount from "@/utils/formatAmount";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import get from "lodash/get";
import { useSearchParams } from "next/navigation";
import { FC } from "react";

import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useWorkspaceEquipmentDefaults } from "@/hooks/useWorkspaceEquipmentDefaults";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

interface Props {
  enableGatewayFee?: boolean;
}

const TotalAmountSummary: FC<Props> = ({ enableGatewayFee = false }) => {
  const param = useSearchParams();
  const catalogId = param.get("catalogId") as string;
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const { data: catalogRes } = useGetCatalogQuery(
    { catalogId, companyId: companyId! },
    { skip: !catalogId || !companyId },
  );
  const catalog = catalogRes?.data;

  const { currencyCode: workspaceCurrencyCode } =
    useWorkspaceEquipmentDefaults();
  const currencySymbol = useWorkspaceCurrencySymbol();

  const { country: equipEmployeeCountry } = useAppSelector(
    (state) => state.persistedReducers.equipEmployee,
  );

  const country = !catalog ? equipEmployeeCountry : catalog.country;

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const { carts: cartItemsData, totalAmount: cartTotalAmount } = useCart();

  const getTotalAmount = () => {
    if (catalogId) {
      if (employees.length === 1) {
        return employees[0]?.items?.reduce(
          (acc, curr) => acc + Number(curr.amount),
          0,
        );
      }
      if (employees.length > 1) {
        return catalog?.total_amount;
      }
    } else {
      return cartTotalAmount;
    }
  };
  const totalAmount = getTotalAmount() ?? 0;

  const getItems = () => {
    if (catalogId) {
      if (employees.length === 1) {
        return employees[0]?.items;
      }
      if (employees.length > 1) {
        const items = employees.map((employee) => employee.items).flat();
        return items;
      }
    } else {
      return cartItemsData;
    }
  };
  const items = getItems();

  const isNigeria = country?.name?.toLowerCase() === "nigeria";
  const isStripe =
    company?.country?.payment_processor?.trim().toLowerCase() === "stripe";

  const { data: serviceFees } = useGetServiceFeesQuery();
  const onboardingFeeRate = serviceFees?.data?.Reassignment ?? 99; // Assuming Reassignment is used for Onboarding

  const getDeviceConfigRate = (currencyCode: string | undefined) => {
    let configRate = 0;

    switch (currencyCode) {
      case "NGN":
        configRate = 10000;
        break;

      default:
        configRate = 50;
        break;
    }

    return configRate;
  };

  const getOnboardingRate = (currencyCode: string | undefined) => {
    let configRate = 0;

    switch (currencyCode) {
      case "NGN":
        configRate = 20000;
        break;

      default:
        configRate = onboardingFeeRate;
        break;
    }

    return configRate;
  };

  const getTotalPlatformFee = () => {
    let platformFee = 0;
    const currencyCode = workspaceCurrencyCode || "USD";

    switch (currencyCode) {
      case "NGN":
        platformFee = 10000;
        break;

      default:
        platformFee = 100;
        break;
    }

    let totalPlatformFee = 0;

    if (company?.subscription?.plan?.slug == "procure") {
      // employees?.forEach((employee) => {
      //   employee?.items?.forEach(() => {
      //     totalPlatformFee += platformFee;
      //   });
      // });
      totalPlatformFee += platformFee;
    }

    return totalPlatformFee;
  };

  const getDeviceConfigFee = () => {
    let configFees = 0;

    const deviceConfigRate = Number(getDeviceConfigRate(workspaceCurrencyCode));

    employees?.forEach((employee) => {
      employee?.items?.forEach((asset: any) => {
        if (asset.device_setup && asset.device_setup.length > 0) {
          configFees += deviceConfigRate;
        }
      });
    });

    return configFees ?? 0;
  };

  const getOnboardingFee = () => {
    let onboardingFee = 0;

    const onboardingRate = Number(getOnboardingRate(workspaceCurrencyCode));

    employees?.forEach((employee) => {
      employee?.items?.forEach(() => {
        onboardingFee += onboardingRate;
      });
    });

    return onboardingFee ?? 0;
  };

  const getInsuranceTotalAmount = () => {
    let totalAmount = 0;

    items?.forEach((item) => {
      const lineTotal =
        Number(item?.pricing?.amount || item?.amount) * item?.quantity!;
      const percentageAmount = lineTotal * 0.05;

      totalAmount += percentageAmount;
    });
    return totalAmount ?? 0;
  };

  const getTotalWithInsurance = () => {
    const insurance = isNigeria ? getInsuranceTotalAmount() : 0;
    const total =
      totalAmount + insurance + getOnboardingFee() + getTotalPlatformFee();
    return total;
  };

  const getPaymentGatewayFees = () => {
    return 0.03 * getTotalWithInsurance();
  };

  const getTotalWithGatewayFees = () => {
    const paymentGatewayFees =
      isStripe && enableGatewayFee ? getPaymentGatewayFees() : 0;
    return getTotalWithInsurance() + paymentGatewayFees;
  };

  const getSubTotal = () => {
    return isStripe
      ? getTotalWithGatewayFees()
      : (getTotalWithInsurance() ?? 0);
  };

  return (
    <div className="w-full mt-8">
      <div className="border-b border-border-secondary py-4 flex flex-row items-center justify-between">
        <span className="text-sm font-medium">Subtotal</span>
        <span className="text-sm font-medium">
          {currencySymbol}
          {formatAmount(totalAmount?.toString()!)}
        </span>
      </div>
      {isNigeria && (
        <div className="border-b border-border-secondary py-4 flex flex-row items-center justify-between">
          <span className="text-sm font-medium">
            Insurance <span className="text-xs">(5%)</span>
          </span>
          <span className="text-sm font-medium">
            {currencySymbol}
            {formatAmount(getInsuranceTotalAmount()?.toString()!)}
          </span>
        </div>
      )}
      {/* {getDeviceConfigFee() > 0 && (
        <div className="border-b border-border-secondary py-4 flex flex-row items-center justify-between">
          <span className="text-sm font-medium">Device configuration</span>
          <span className="text-sm font-medium">
            {currencySymbol}
            {formatAmount(getDeviceConfigFee()?.toString()!)}
          </span>
        </div>
      )} */}
      {getTotalPlatformFee() > 0 && (
        <div className="border-b border-border-secondary py-4 flex flex-row items-center justify-between">
          <span className="text-sm font-medium">Platform Fee </span>
          <span className="text-sm font-medium">
            {currencySymbol}
            {formatAmount(getTotalPlatformFee()?.toString()!)}
          </span>
        </div>
      )}
      {getOnboardingFee() > 0 && (
        <div className="border-b border-border-secondary py-4 flex flex-row items-center justify-between">
          <span className="text-sm font-medium">
            Onboarding Fee{" "}
            <span className="text-xs">
              ({currencySymbol}
              {onboardingFeeRate} per device)
            </span>{" "}
          </span>
          <span className="text-sm font-medium">
            {currencySymbol}
            {formatAmount(getOnboardingFee()?.toString()!)}
          </span>
        </div>
      )}
      {isStripe && enableGatewayFee && (
        <div className="border-b border-border-secondary py-4 flex flex-row items-center justify-between">
          <span className="text-sm font-medium">
            Payment Gateway Fees <span className="text-xs">(3%)</span>
          </span>
          <span className="text-sm font-medium">
            {currencySymbol}
            {formatAmount(getPaymentGatewayFees()?.toString()!)}
          </span>
        </div>
      )}
      <div className="py-4 flex flex-row items-center justify-between">
        <span className="text-lg font-bold">Total</span>
        <span className="text-lg font-bold">
          {currencySymbol}
          {formatAmount(getSubTotal()?.toString()!)}
        </span>
      </div>
    </div>
  );
};

export default TotalAmountSummary;
