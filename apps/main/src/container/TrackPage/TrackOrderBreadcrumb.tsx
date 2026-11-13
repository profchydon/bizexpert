import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface TrackOrderBreadcrumbProps {
  orderType?: string;
  orderTypeDisplay?: string;
}

const getOrderTypeLabel = (
  orderType?: string,
  orderTypeDisplay?: string,
): string => {
  if (orderTypeDisplay?.trim()) {
    return `${orderTypeDisplay.trim()} order`;
  }

  const normalized = String(orderType || "")
    .trim()
    .toLowerCase();

  const orderTypeMap: Record<string, string> = {
    onboarding: "Onboard device",
    offboarding: "Off board device",
    device_refresh: "Device refresh",
    storage_to_employee: "Storage to employee",
    buy_to_storage: "Buy to storage",
    renew_storage: "Renew storage",
  };

  return orderTypeMap[normalized] || "Order";
};

export const TrackOrderBreadcrumb = ({
  orderType,
  orderTypeDisplay,
}: TrackOrderBreadcrumbProps) => {
  const orderTypeLabel = getOrderTypeLabel(orderType, orderTypeDisplay);

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs sm:text-sm text-gray-500">
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="text-gray-500">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="font-medium text-gray-600">
            {orderTypeLabel}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="font-medium text-gray-400">
            ...
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="font-semibold text-primary-600">
            Order tracking
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
