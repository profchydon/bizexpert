import {
  DeliveryItem,
  OrderDetailsData,
} from "@/api/baseQueries/companiesApi/ordersApi/getOrderDetails";
import { IOrder, ISubOrder } from "@/types/orders";

export interface OrderVerificationViewModel {
  orderId: string;
  orderNumber: string;
  orderType: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  address: string;
  nearestLandmark: string;
  employmentType: string;
  estimatedFulfillmentStartDate: string;
  note: string;
  signatureRequested: boolean;
  items: Array<{
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
  }>;
}

type GenericSubOrder = ISubOrder & {
  recipient?: {
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    employment_type?: string;
    country?: string;
    country_code?: string;
    address?: string;
  };
};

const toText = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const buildName = (firstName?: string, lastName?: string, fallback = "N/A") => {
  const name = `${firstName || ""} ${lastName || ""}`.trim();
  return name || fallback;
};

const normalizeItems = (
  endpointItems: DeliveryItem[] | undefined,
  subOrders: GenericSubOrder[],
) => {
  if (endpointItems?.length) {
    return endpointItems.map((item, index) => ({
      id: toText(item.id, `item-${index + 1}`),
      title: toText(item.title || item.description, "Unnamed item"),
      description: toText(item.description),
      imageUrl: toText(item.image_url),
    }));
  }

  const itemsFromSubOrders = subOrders.flatMap((subOrder) => {
    const equipmentTitle = toText(
      subOrder?.equipment?.description || subOrder?.equipment?.title,
    );
    if (!equipmentTitle) return [];

    return [
      {
        id: toText(subOrder.id, equipmentTitle),
        title: equipmentTitle,
        description: toText(subOrder?.equipment?.model),
        imageUrl: toText(subOrder?.equipment?.image_url),
      },
    ];
  });

  return itemsFromSubOrders;
};

const normalizeInstanceFields = (
  orderType: string,
  order: IOrder | null,
  details: OrderDetailsData | null,
) => {
  const subOrders = (order?.sub_orders ||
    details?.sub_orders ||
    []) as GenericSubOrder[];
  const firstSubOrder = subOrders?.[0];
  const orderDetails = (firstSubOrder?.order_details || {}) as Record<
    string,
    any
  >;

  if (orderType === "onboarding" || orderType === "storage_to_employee") {
    return {
      fullName: buildName(
        firstSubOrder?.employee_first_name,
        firstSubOrder?.employee_last_name,
      ),
      email: toText(
        details?.recipient?.email || firstSubOrder?.recipient?.email,
      ),
      phone: toText(
        details?.recipient?.phone || firstSubOrder?.recipient?.phone,
      ),
      country: toText(
        details?.delivery_address?.country || firstSubOrder?.recipient?.country,
      ),
      countryCode: toText(
        details?.delivery_address?.country_code ||
          firstSubOrder?.recipient?.country_code,
      ),
      address: toText(
        details?.delivery_address?.address || firstSubOrder?.address,
      ),
      nearestLandmark: toText(details?.delivery_address?.nearest_landmark),
      employmentType: toText(
        details?.recipient?.employment_type || firstSubOrder?.job_title,
      ),
    };
  }

  if (orderType === "buy_to_storage") {
    return {
      fullName: toText(details?.recipient?.full_name, "Storage Team"),
      email: toText(details?.recipient?.email),
      phone: toText(details?.recipient?.phone),
      country: toText(details?.delivery_address?.country || order?.country),
      countryCode: toText(
        details?.delivery_address?.country_code || order?.country_code,
      ),
      address: toText(details?.delivery_address?.address, "Storage address"),
      nearestLandmark: toText(details?.delivery_address?.nearest_landmark),
      employmentType: toText(details?.recipient?.employment_type, "Storage"),
    };
  }

  if (orderType === "offboarding" && firstSubOrder?.type === "reassign") {
    return {
      fullName: buildName(
        orderDetails?.to?.first_name,
        orderDetails?.to?.last_name,
      ),
      email: toText(orderDetails?.to?.email),
      phone: toText(orderDetails?.to?.phone),
      country: toText(
        details?.delivery_address?.country || orderDetails?.to?.country,
      ),
      countryCode: toText(
        details?.delivery_address?.country_code ||
          orderDetails?.to?.country_code,
      ),
      address: toText(
        details?.delivery_address?.address || orderDetails?.to?.address,
      ),
      nearestLandmark: toText(details?.delivery_address?.nearest_landmark),
      employmentType: toText(orderDetails?.to?.employment_type),
    };
  }

  return {
    fullName:
      toText(details?.recipient?.full_name) ||
      toText(firstSubOrder?.equipment?.assignee?.name, "N/A"),
    email: toText(details?.recipient?.email),
    phone: toText(details?.recipient?.phone),
    country: toText(details?.delivery_address?.country || order?.country),
    countryCode: toText(
      details?.delivery_address?.country_code || order?.country_code,
    ),
    address: toText(
      details?.delivery_address?.address || firstSubOrder?.address,
    ),
    nearestLandmark: toText(details?.delivery_address?.nearest_landmark),
    employmentType: toText(details?.recipient?.employment_type),
  };
};

export const mapOrderDetailsToVerificationViewModel = (
  order: IOrder | null,
  details: OrderDetailsData | null,
): OrderVerificationViewModel => {
  const orderType = String(details?.type || order?.type || "").toLowerCase();
  const subOrders = (order?.sub_orders ||
    details?.sub_orders ||
    []) as GenericSubOrder[];

  const normalized = normalizeInstanceFields(orderType, order, details);

  return {
    orderId: toText(details?.id || order?.id),
    orderNumber: toText(details?.order_number || order?.order_number),
    orderType,
    fullName: normalized.fullName,
    email: normalized.email,
    phone: normalized.phone,
    country: normalized.country,
    countryCode: normalized.countryCode,
    address: normalized.address,
    nearestLandmark: normalized.nearestLandmark,
    employmentType: normalized.employmentType,
    estimatedFulfillmentStartDate: toText(
      details?.delivery_address?.estimated_fulfillment_start_date,
    ),
    note: toText(details?.note),
    signatureRequested: Boolean(
      details?.signature_requested ?? order?.signature_requested,
    ),
    items: normalizeItems(details?.delivery_items, subOrders),
  };
};
