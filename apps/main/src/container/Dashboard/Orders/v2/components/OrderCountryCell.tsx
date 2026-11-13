import React from "react";
import ReactCountryFlag from "react-country-flag";
import CustomTooltip from "@/components/CustomTooltip";
import { getUniqueCountries } from "@/utils/getUniqueCountries";
import { OrderFlowType } from "@/types/offboarding";
import { IOrder, ISubOrder } from "@/types/orders";
import { storageToEmployeeDeliveryCountries } from "../storageToEmployeeDeliveryCountry";

function extractSubOrders(order: IOrder): ISubOrder[] {
  const raw = (order?.sub_orders as any)?.data ?? order?.sub_orders;
  if (Array.isArray(raw)) return raw as ISubOrder[];
  if (Array.isArray(raw?.data)) return raw.data as ISubOrder[];
  return [];
}

function collectOffboardingCountries(order: IOrder) {
  const combined = new Map<string, { name: string; code: string }>();
  extractSubOrders(order).forEach((subOrder: any) => {
    const defaultCountry = {
      name: subOrder?.equipment?.country as string,
      code: subOrder?.equipment?.country_code as string,
    };
    getUniqueCountries(defaultCountry).forEach((country) => {
      const key = `${country.name}-${country.code}`;
      if (!combined.has(key)) combined.set(key, country);
    });
  });
  return Array.from(combined.values());
}

const OrderCountryCell: React.FC<{ order: IOrder }> = ({ order }) => {
  const orderType = order?.type as unknown as OrderFlowType;
  const deliveryCountries =
    orderType === "storage_to_employee"
      ? storageToEmployeeDeliveryCountries(order)
      : [];

  if (orderType === "offboarding") {
    const countries = collectOffboardingCountries(order);

    if (countries.length === 1) {
      return (
        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={countries[0]?.code}
            svg
            style={{ width: "24px", height: "24px" }}
          />
          <span className="truncate text-sm text-gray-700">
            {countries[0]?.name}
          </span>
        </div>
      );
    }

    if (countries.length > 1) {
      return (
        <div className="flex items-center gap-2">
          {countries.slice(0, 3).map((item) => (
            <div
              key={`${item?.code}-${item?.name}`}
              className="-ml-2 first:ml-0"
            >
              <CustomTooltip
                content={<span className="text-white">{item?.name}</span>}
              >
                <ReactCountryFlag
                  countryCode={item?.code}
                  svg
                  style={{ width: "24px", height: "24px" }}
                />
              </CustomTooltip>
            </div>
          ))}
          {countries.length > 3 && (
            <span className="text-xs text-gray-500">
              +{countries.length - 3}
            </span>
          )}
        </div>
      );
    }

    return <span className="text-xs text-gray-500">0 countries</span>;
  }

  const deliveryCountry = deliveryCountries[0];
  const name = deliveryCountry?.name || order?.country || "";
  const code = deliveryCountry
    ? deliveryCountry.code
    : order?.country_code || "";

  return (
    <div className="flex items-center gap-2">
      <ReactCountryFlag
        countryCode={code}
        svg
        style={{ width: "24px", height: "24px" }}
      />
      <span className="truncate text-sm text-gray-700">{name}</span>
    </div>
  );
};

export default OrderCountryCell;
