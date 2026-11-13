import Link from "next/link";
import type { ReactNode } from "react";

import routes from "@/routes";

type OrderSummaryBreadcrumbArgs = {
  catalog?: { id?: string; name?: string } | null;
  isApprovalFlow?: boolean;
  isUnassigned: boolean;
};

export function orderSummaryBreadcrumbs({
  catalog,
  isApprovalFlow = false,
  isUnassigned,
}: OrderSummaryBreadcrumbArgs): ReactNode[] {
  if (isApprovalFlow) {
    return [
      <Link key="approvals" href={routes.APPROVALS}>
        Approvals
      </Link>,
      <span key="order-summary" className="text-primary-600">
        Order summary
      </span>,
    ];
  }

  if (catalog) {
    return [
      <Link key="catalog-home" href={routes.CATALOGS}>
        Catalog
      </Link>,
      <Link key="catalog-details" href={`${routes.CATALOGS}/${catalog.id}`}>
        {catalog.name}
      </Link>,
      <Link
        key="employee-requests"
        href={{
          pathname: routes.CATALOGS_EMPLOYEES_REQUEST,
          query: { catalogId: catalog.id },
        }}
      >
        Employee Requests
      </Link>,
      <span key="order-summary" className="text-primary-600">
        Order summary
      </span>,
    ];
  }

  if (!isUnassigned) {
    return [
      <Link key="marketplace" href={routes.EQUIP_EMPLOYEE_MARKETPLACE}>
        Marketplace
      </Link>,
      <Link key="assign-devices" href={routes.EQUIP_EMPLOYEE_EMPLOYEES}>
        Assign devices
      </Link>,
      <span key="order-summary" className="text-primary-600">
        Order summary
      </span>,
    ];
  }

  return [
    <Link key="onboard-device" href={routes.EQUIP_EMPLOYEE}>
      Onboard device
    </Link>,
    <span key="order-summary" className="text-primary-600">
      Order summary
    </span>,
  ];
}
