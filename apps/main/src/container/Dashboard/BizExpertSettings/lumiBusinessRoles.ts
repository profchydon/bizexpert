import type { BusinessRole } from "@/types/bizexpert";

export type DefaultBusinessRoleId = BusinessRole;

export type DefaultBusinessRole = {
  id: DefaultBusinessRoleId;
  name: string;
  isDefault: true;
  summary: string;
  access: string[];
};

export const DEFAULT_BUSINESS_ROLES: DefaultBusinessRole[] = [
  {
    id: "owner",
    name: "Owner",
    isDefault: true,
    summary: "Full access. Created with the business and cannot be removed.",
    access: [
      "Add and remove team members",
      "Change a member's role except owner",
      "Update business and WhatsApp settings",
      "Approve stocktakes and sell at every store",
    ],
  },
  {
    id: "admin",
    name: "Admin",
    isDefault: true,
    summary: "Same access as owner, except the owner cannot be removed.",
    access: [
      "Add and remove team members except the owner",
      "Change a member's role except owner",
      "Update business and WhatsApp settings",
      "Approve stocktakes and sell at every store",
    ],
  },
  {
    id: "business_manager",
    name: "Business manager",
    isDefault: true,
    summary: "Day-to-day operations across stores, without team or settings.",
    access: [
      "Approve stocktakes",
      "Sell and move stock at every store",
      "Cannot add members or change roles",
    ],
  },
  {
    id: "store_keeper",
    name: "Store keeper",
    isDefault: true,
    summary: "Stock work at stores they are assigned to.",
    access: [
      "Receive, transfer, or adjust stock where assigned",
      "Count stocktakes at assigned stores",
      "Cannot sell or manage team",
    ],
  },
  {
    id: "developer",
    name: "Developer",
    isDefault: true,
    summary: "Member access without selling, stock, or team admin.",
    access: [
      "View the dashboard as a member",
      "Cannot sell, manage team, or approve stocktakes",
    ],
  },
  {
    id: "customer_support",
    name: "Customer support",
    isDefault: true,
    summary: "Sales at stores they are assigned to.",
    access: [
      "Create sales at stores they can sell from",
      "Cannot manage team or approve stocktakes",
    ],
  },
  {
    id: "waybill_manager",
    name: "Waybill manager",
    isDefault: true,
    summary: "Stock transfers at stores they are assigned to.",
    access: ["Transfer stock where assigned", "Cannot sell or manage team"],
  },
  {
    id: "sales_cashier",
    name: "Sales cashier",
    isDefault: true,
    summary: "Selling at stores they are assigned to.",
    access: [
      "Create sales at stores they can sell from",
      "Cannot manage team or approve stocktakes",
    ],
  },
  {
    id: "cashier",
    name: "Cashier",
    isDefault: true,
    summary: "Selling at stores they are assigned to.",
    access: [
      "Create sales at stores they can sell from",
      "Cannot manage team or approve stocktakes",
    ],
  },
  {
    id: "store_manager",
    name: "Store manager",
    isDefault: true,
    summary: "Store operations across locations, without team or settings.",
    access: [
      "Approve stocktakes",
      "Sell and move stock at every store",
      "Cannot add members or change roles",
    ],
  },
  {
    id: "accountant",
    name: "Accountant",
    isDefault: true,
    summary: "Member access without selling, stock, or team admin.",
    access: [
      "View the dashboard as a member",
      "Cannot sell, manage team, or approve stocktakes",
    ],
  },
];
