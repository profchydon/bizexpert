import Link from "next/link";
import routes from "@/routes";
import { ICatalog } from "@/types/catalog";

export const buildEquipOrderSummaryLegacyBreadcrumbs = ({
  catalog,
  isUnassigned,
}: {
  catalog?: ICatalog;
  isUnassigned: boolean;
}) => {
  if (catalog) {
    return [
      <Link key="catalogs" href={routes.CATALOGS}>
        Catalog
      </Link>,
      <Link key="catalog" href={`${routes.CATALOGS}/${catalog.id}`}>
        {catalog.name}
      </Link>,
      <Link
        key="requests"
        href={{
          pathname: routes.CATALOGS_EMPLOYEES_REQUEST,
          query: { catalogId: catalog.id },
        }}
      >
        Employee Requests
      </Link>,
      <span key="summary" className="text-primary-600">
        Order summary
      </span>,
    ];
  }

  if (!isUnassigned) {
    return [
      <Link key="onboard" href={routes.EQUIP_EMPLOYEE}>
        Onboard device
      </Link>,
      <Link key="marketplace" href={routes.EQUIP_EMPLOYEE_MARKETPLACE}>
        Marketplace
      </Link>,
      <Link key="employees" href={routes.EQUIP_EMPLOYEE_EMPLOYEES}>
        Add Employees
      </Link>,
      <Link key="devices" href={routes.EQUIP_EMPLOYEE_DEVICES}>
        Add Devices
      </Link>,
      <span key="summary" className="text-primary-600">
        Order summary
      </span>,
    ];
  }

  return [
    <Link key="onboard" href={routes.EQUIP_EMPLOYEE}>
      Onboard device
    </Link>,
    <span key="summary" className="text-primary-600">
      Order summary
    </span>,
  ];
};
