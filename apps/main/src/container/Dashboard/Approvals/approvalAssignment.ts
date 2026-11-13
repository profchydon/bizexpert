import type { ICart } from "@/types/cart";
import type { IEmployees } from "@/types/employees";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";
import type { ApprovalActionOptions } from "./types";
import { groupByEmployee } from "../EquipEmployee/AssignmentFlow/utils";
import { orderRequestToRecord } from "./apiAdapters";
import { approvalOrderSummaryItems } from "./approvalOrderSummaryItems";
import {
  employeeName,
  findNestedText,
  firstText,
  isIdLikeValue,
  objectValue,
  textValue,
} from "./approvalAssignmentValues";
import type { ApprovalItem, ApprovalRecord } from "./types";
export { approvalOrderSummaryPath } from "./approvalOrderSummaryPath";

export function approvalRequestToAssignedEmployees({
  employee,
  options,
  record,
  request,
}: {
  employee?: IEmployees | null;
  options?: ApprovalActionOptions;
  record?: ApprovalRecord | null;
  request?: CatalogOrderRequestApi | null;
}) {
  const summaryRecord = request ? orderRequestToRecord(request) : record;
  if (!summaryRecord?.employeeId) return [];

  const assignedEmployee = approvalRequestEmployee(
    request,
    summaryRecord,
    employee,
    options,
  );
  const carts = approvalOrderSummaryItems({
    record: summaryRecord,
    request,
  }).flatMap((item) =>
    approvalItemToCart(item, summaryRecord, assignedEmployee),
  );
  const units = carts.flatMap((cart) =>
    Array.from({ length: cart.quantity }, (_, index) => ({
      cartItem: { ...cart, quantity: 1 },
      destination: {
        employeeId: String(assignedEmployee.id),
        employeeName: employeeName(assignedEmployee),
        type: "employee" as const,
      },
      unitId: `${cart.pricing.id}-${index}`,
    })),
  );

  return groupByEmployee(units, [
    {
      id: String(assignedEmployee.id),
      name: employeeName(assignedEmployee),
      raw: assignedEmployee,
    },
  ]);
}

function approvalRequestEmployee(
  request: CatalogOrderRequestApi | null | undefined,
  record: ApprovalRecord,
  employeeDetail?: IEmployees | null,
  options?: ApprovalActionOptions,
) {
  const employee = objectValue(request?.employee);
  const country = objectValue(employee?.country);
  const fallbackName = record.employee?.name ?? textValue(employee?.name);
  const [fallbackFirstName = "", ...rest] = fallbackName.split(" ");

  return {
    ...(employeeDetail ?? {}),
    address: firstText([
      employeeDetail?.address,
      findNestedText(employee, ["address", "full_address", "street_address"]),
      findNestedText(request, ["delivery_address", "shipping_address"]),
    ]),
    country: firstText([
      employeeDetail?.country,
      country?.name,
      employee?.country,
    ]),
    country_code: firstText([
      employeeDetail?.country_code,
      employee?.country_code,
      country?.code,
    ]),
    country_id: firstText([
      employeeDetail?.country_id,
      employee?.country_id,
      country?.id,
    ]),
    approvalAcknowledgeBudgetWarning: Boolean(
      options?.acknowledgeBudgetWarning,
    ),
    approvalCatalogId: record.catalogId,
    email: firstText([employeeDetail?.email, employee?.email]),
    employment_type: firstText([
      employeeDetail?.employment_type,
      findNestedText(employee, ["employment_type", "employee_type", "type"]),
      findNestedText(request, ["employment_type", "employee_type"]),
    ]),
    first_name: firstText([
      employeeDetail?.first_name,
      employee?.first_name,
      fallbackFirstName,
    ]),
    id: record.employeeId,
    items: [] as ICart[],
    last_name: firstText([
      employeeDetail?.last_name,
      employee?.last_name,
      rest.join(" "),
    ]),
    phone: firstText([
      employeeDetail?.phone,
      findNestedText(employee, ["phone", "phone_number", "mobile"]),
      findNestedText(request, ["phone", "phone_number", "mobile"]),
    ]),
    requestId: request?.id ?? record.id,
  } as IEmployees;
}

function approvalItemToCart(
  item: ApprovalItem,
  record: ApprovalRecord,
  employee: IEmployees,
) {
  const pricingId = item.assetPricingId ?? item.id;
  if (!pricingId) return [];

  const quantity = Math.max(1, Number(item.quantity ?? 1));
  const unitAmount = item.rfqBudgetPerUnit ?? (item.amount ?? 0) / quantity;
  const specificationId = item.assetSpecificationId ?? item.id;

  return [
    {
      amount: String(item.amount ?? unitAmount * quantity),
      asset: {
        category: item.category ?? "",
        country: employee.country,
        description: item.description ?? "",
        id: item.id,
        images: item.imageUrl ? [item.imageUrl] : [],
        name: item.name ?? "Equipment",
      },
      country: {
        code: employee.country_code,
        id: employee.country_id,
        label: employee.country,
        name: employee.country,
      },
      images: item.imageUrl ? [item.imageUrl] : null,
      pricing: {
        amount: String(unitAmount),
        asset_specification_id: specificationId,
        country_id: employee.country_id,
        currency_code: record.currencyCode,
        id: pricingId,
      },
      quantity,
      source: item.source,
      specification: {
        id: specificationId,
        properties: approvalItemProperties(item),
        spec: approvalItemProperties(item),
      },
    } as unknown as ICart,
  ];
}

function approvalItemProperties(item: ApprovalItem) {
  return [
    ...(item.category ? [{ name: "Category", value: item.category }] : []),
    ...(item.assetType && !isIdLikeValue(item.assetType)
      ? [{ name: "Asset type", value: item.assetType }]
      : []),
  ];
}
