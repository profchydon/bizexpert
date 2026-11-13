import routes from "@/routes";
import type { NavItem } from "./NavItems.data";

export function bizexpertNavItems(pathname: string): NavItem[] {
  const match = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const inventoryOpen =
    match(routes.LOCATIONS) ||
    match(routes.CATEGORIES) ||
    match(routes.PRODUCTS) ||
    match(routes.INVENTORY);

  return [
    {
      id: "overview",
      name: "Overview",
      link: routes.OVERVIEW,
      isActive: match(routes.OVERVIEW),
    },
    {
      id: "inventory",
      name: "Inventory",
      link: routes.INVENTORY,
      isActive: inventoryOpen,
      children: [
        {
          id: "stores",
          name: "Stores",
          link: routes.LOCATIONS,
        },
        {
          id: "categories",
          name: "Categories",
          link: routes.CATEGORIES,
        },
        {
          id: "products",
          name: "Products",
          link: routes.PRODUCTS,
        },
        {
          id: "stock",
          name: "Stock",
          link: routes.INVENTORY,
        },
        {
          id: "track-item",
          name: "Track item",
          link: routes.TRACK_ITEM,
        },
        {
          id: "stock-removals",
          name: "Stock removals",
          link: routes.STOCK_REMOVALS,
        },
      ],
    },
    {
      id: "customers",
      name: "Customers",
      link: routes.CUSTOMERS,
      isActive: match(routes.CUSTOMERS),
    },
    {
      id: "integrations",
      name: "Integrations",
      link: routes.INTEGRATIONS,
      isActive: match(routes.INTEGRATIONS),
    },
    {
      id: "sales",
      name: "Sales",
      link: routes.SALES,
      isActive: match(routes.SALES),
    },
    {
      id: "payments",
      name: "Payments",
      link: routes.PAYMENTS,
      isActive: match(routes.PAYMENTS),
      children: [
        {
          id: "payment-list",
          name: "Payments",
          link: routes.PAYMENTS,
        },
        {
          id: "payment-transactions",
          name: "Transactions",
          link: routes.PAYMENTS_TRANSACTIONS,
        },
        {
          id: "cashflow-analytics",
          name: "Cashflow",
          link: routes.PAYMENTS_CASHFLOW,
        },
        {
          id: "customer-analytics",
          name: "Customer analytics",
          link: routes.PAYMENTS_CUSTOMERS,
        },
      ],
    },
    {
      id: "purchases",
      name: "Purchases",
      link: routes.PURCHASES,
      isActive: match(routes.PURCHASES),
    },
    {
      id: "team",
      name: "Team",
      link: routes.TEAM,
      isActive: match(routes.TEAM),
    },
    {
      id: "settings",
      name: "Settings",
      link: routes.SETTINGS,
      isActive: match(routes.SETTINGS),
    },
  ];
}
