export type ApprovalStatus =
  | "AWAITING_APPROVAL"
  | "AWAITING_RFQ"
  | "APPROVED"
  | "FAILED"
  | "CANCELLED";

export type ApprovalFilterTab = "all" | "awaiting" | "history";
export type ItemSource = "STORAGE" | "MARKETPLACE" | "RFQ" | "UNAVAILABLE";
export type ItemTier = "IMPORTANT" | "REQUIRED" | "OPTIONAL";
export type SortColumn = "employee" | "kit" | "status" | "total";
export type SortDirection = "ascending" | "descending";

export interface ApprovalEmployee {
  id: string;
  name?: string;
  initials?: string;
  role?: string;
  country?: string;
  level?: string;
}

export interface ApprovalItem {
  id: string;
  amount?: number;
  assetPricingId?: string;
  assetSpecificationId?: string;
  assetType?: string;
  categoryId?: string;
  description?: string;
  kitId?: string;
  kitItemId?: string;
  name?: string;
  category?: string;
  tier?: ItemTier;
  quantity?: number;
  rfqBudgetPerUnit?: number;
  source?: ItemSource;
  leadTimeDays?: number;
  imageUrl?: string;
}

export interface ApprovalRecord {
  id: string;
  catalogId: string;
  catalogRuleId?: string;
  employeeId: string;
  employee?: ApprovalEmployee;
  kitId?: string;
  kitName?: string;
  matchedRuleName?: string;
  allowItemSwap: boolean;
  items: ApprovalItem[];
  budgetAmount?: number;
  budgetTotalAmount?: number;
  budgetExceeded?: boolean;
  currencyCode?: string;
  currencySymbol?: string;
  fulfillmentSources?: ItemSource[];
  status?: ApprovalStatus;
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  actionedBy?: { admin: string; at?: string };
  orderId?: string;
  orderNote?: string;
  pendingRfqs?: ApprovalRfqSummary[];
  rejectionReason?: string;
  orderRef?: string;
}

export interface ApprovalRfqSummary {
  id: string;
  requestId?: string;
  status?: string;
}

export interface ApprovalActionOptions {
  acknowledgeBudgetWarning?: boolean;
}

export interface ApprovalSort {
  column: SortColumn;
  direction: SortDirection;
}
