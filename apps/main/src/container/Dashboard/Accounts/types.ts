export type AdminRole = "global" | "subsidiary" | "office";

export type PlanTier = "scale" | "operate" | "manage" | "procure";

export const UNMAPPED_SUBSIDIARY_STATUS = "N/A" as const;

export type SubsidiaryStatus =
  | "operational"
  | "card-pending"
  | "suspended"
  | "permanent-card-only"
  | "closed"
  | "delegated"
  | typeof UNMAPPED_SUBSIDIARY_STATUS;

export type CreditState = "card-only" | "assessing" | "active-credit";

export type BillingMode = "self" | "delegated";

export type CardCaptureOutcome = "success" | "stalled";

export interface SubsidiaryDraft {
  name: string;
  email: string;
  region: string | null;
  currency: string | null;
  adminUserIds: string[];
  billingMode: BillingMode;
  billingEntityId: string | null;
}

export interface ActingAdmin {
  role: AdminRole;
  name: string;
  userId?: string;
  activeEntityId?: string | null;
  administeredEntityIds: string[];
  officeIds: string[];
}

export interface Subsidiary {
  id: string;
  name: string;
  region: string;
  currency: string;
  admins: string[];
  status: SubsidiaryStatus;
  officesCount: number;
  creditState: CreditState;
  cardOnFile: boolean;
  createdDaysAgo: number;
  createdBy: string;
  isPrimary?: boolean;
  billingMode: BillingMode;
  billingEntityId: string;
  billingEntityName: string;
  billingCurrency: string;
  billingConfirmedAt?: string;
  billingConfirmedBy?: string;
}

export interface OfficeAdminRef {
  id?: string;
  name: string;
}

export interface Office {
  id: string;
  name: string;
  subsidiaryId: string;
  subsidiaryName: string;
  region: string;
  type: "Physical" | "Remote";
  currency: string;
  address?: string;
  officeAdmins: string[];
  officeAdminRefs?: OfficeAdminRef[];
  status: "active" | "shutting_down" | "closed";
  isPrimary?: boolean;
  createdDaysAgo?: number;
  createdBy?: string;
}

export interface OfficeDraft {
  name: string;
  parentId: string | null;
  type: "physical" | "remote";
  address: string;
  adminNames: string[];
}

export interface OfficeParent {
  id: string;
  name: string;
  region: string;
  currency: string;
  officesCount: number;
}

export interface PreFlightCheck {
  ok: boolean;
  label: string;
  blocked?: string;
}

export interface CloseSubsidiaryBlockers {
  hasActiveOffices: boolean;
  hasOutstandingReceivables: boolean;
}

export type SubsidiarySortKey =
  | "name"
  | "region"
  | "currency"
  | "offices"
  | "status";

export type SortDirection = "asc" | "desc";

export interface SubsidiarySort {
  column: SubsidiarySortKey | "";
  direction: SortDirection;
}
