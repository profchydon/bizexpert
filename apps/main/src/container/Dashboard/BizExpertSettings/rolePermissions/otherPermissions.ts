import { toPermissions, type PermissionRow } from "./permissionTypes";

const EXPENSE_ROWS: PermissionRow[] = [
  ["can_view_all_expenses", "can view all expenses", null],
  ["can_change_expense_category", "can change expense category", null],
  [
    "can_view_edit_and_create_expense_category",
    "Can view, edit and create expense category",
    null,
  ],
  ["can_approve_expense", "Can approve expense", null],
  ["can_create_expense", "Can create expense", null],
  ["can_view_expense_analytics", "Can view expense analytics", null],
];

const PAYMENTS_ROWS: PermissionRow[] = [
  ["can_request_working_capital", "Can request working capital", null],
  ["can_delete_customer", "Can delete customer", "manageSettings"],
  ["can_update_customer", "Can update customer", "credit"],
  ["can_create_customer", "Can create customer", "sell"],
  ["can_update_payment_gateway", "Can update payment gateway", null],
  ["can_delete_payment_gateway", "Can delete payment gateway", null],
  [
    "can_activate_deactivate_payment_gateway",
    "Can activate deactivate payment gateway",
    null,
  ],
  ["can_create_payment_gateway", "Can Create Payment Gateway", null],
  ["can_delete_tags", "Can Delete Tags", null],
  ["can_view_tags", "Can View Tags", null],
  ["can_edit_tags", "Can Edit Tags", null],
  ["can_create_tags", "Can Create Tags", null],
  ["can_view_and_request_pos", "Can View and request POS", null],
  [
    "can_download_statement_of_account",
    "Can download statement of account",
    null,
  ],
  ["can_view_transactions_history", "Can View Transactions History", "view"],
  ["can_authorize_a_transfer", "Can Authorize a transfer", null],
  ["can_request_transfer", "Can Request Transfer", null],
  ["can_view_transfer", "Can View Transfer", null],
  [
    "can_view_payment_dashboard",
    "Can view Payment dashboard( Overview, cash and customer analytics)",
    "view",
  ],
];

const LOYALTY_ROWS: PermissionRow[] = [
  ["can_redeem_gift_card", "Can redeem gift card", null],
  ["can_view_and_create_gift_cards", "Can view and create gift cards", null],
  [
    "can_view_and_create_loyalty_campaigns",
    "Can view and create Loyalty campaigns",
    null,
  ],
];

const ACCOUNTING_ROWS: PermissionRow[] = [
  ["can_void_journal_entry", "can_void_journal_entry", null],
  [
    "can_post_or_approve_journal_entry",
    "can_post_or_approve_journal_entry",
    null,
  ],
  ["can_view_accounting_reports", "can_view_accounting_reports", null],
  ["can_view_account_mappings", "can_view_account_mappings", null],
  ["can_manage_account_mappings", "can_manage_account_mappings", null],
  ["can_view_journal_entries", "can_view_journal_entries", null],
  ["can_create_journal_entry", "can_create_journal_entry", null],
  ["can_export_vat_logs", "can_export_vat_logs", null],
  ["can_view_vat_summary", "can_view_vat_summary", null],
  ["can_view_vat_logs", "can_view_vat_logs", null],
  ["can_allow_ledger_account", "can allow ledger account", null],
  ["can_delete_ledger_account", "can delete ledger account", null],
  ["can_update_ledger_account", "can update ledger account", null],
  ["can_create_ledger_account", "can create ledger account", null],
  ["can_view_all_reports", "Can View All Reports", "view"],
];

const CUSTOMERS_ROWS: PermissionRow[] = [
  ["can_view_marketing_audience", "Can view marketing audience", null],
  [
    "can_cancel_or_delete_marketing_campaign",
    "Can cancel or delete marketing campaign",
    null,
  ],
  ["can_view_marketing_campaign", "Can view marketing campaign", null],
  [
    "can_create_or_update_marketing_campaign",
    "Can create or update marketing campaign",
    null,
  ],
  [
    "can_create_or_update_marketing_audience",
    "Can create or update marketing audience",
    null,
  ],
  [
    "can_update_customer_credit_limit",
    "Can update customer credit limit",
    "credit",
  ],
  ["can_view_customer", "Can view customer", "view"],
];

const SETTINGS_ROWS: PermissionRow[] = [
  ["can_view_activity_logs", "can view activity logs", "viewAudit"],
  ["can_submit_bvn_and_kyb", "Can submit BVN and KYB", null],
  ["can_delete_users", "Can delete users", "manageMembers"],
  ["can_update_subscriptions", "Can update subscriptions", null],
  ["can_view_and_update_api_key", "Can View & Update API Key", null],
  [
    "can_edit_and_update_settlement_accounts",
    "Can edit and update settlement accounts",
    null,
  ],
  ["can_create_custom_roles", "Can create custom roles", null],
  [
    "can_create_update_and_invite_users",
    "Can create, update and invite users",
    "manageMembers",
  ],
  [
    "can_update_business_profile",
    "Can update business profile",
    "manageSettings",
  ],
];

export const EXPENSE_PERMISSIONS = toPermissions("Expense", EXPENSE_ROWS);
export const PAYMENTS_PERMISSIONS = toPermissions("Payments", PAYMENTS_ROWS);
export const LOYALTY_PERMISSIONS = toPermissions("Loyalty", LOYALTY_ROWS);
export const ACCOUNTING_PERMISSIONS = toPermissions(
  "Accounting",
  ACCOUNTING_ROWS,
);
export const CUSTOMERS_PERMISSIONS = toPermissions("Customers", CUSTOMERS_ROWS);
export const SETTINGS_PERMISSIONS = toPermissions("Settings", SETTINGS_ROWS);
