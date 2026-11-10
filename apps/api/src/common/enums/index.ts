export enum BusinessRole {
  OWNER = "owner",
  ADMIN = "admin",
  BUSINESS_MANAGER = "business_manager",
  STORE_KEEPER = "store_keeper",
  DEVELOPER = "developer",
  CUSTOMER_SUPPORT = "customer_support",
  WAYBILL_MANAGER = "waybill_manager",
  SALES_CASHIER = "sales_cashier",
  CASHIER = "cashier",
  STORE_MANAGER = "store_manager",
  ACCOUNTANT = "accountant",
}

export enum LocationType {
  SHOP = "shop",
  WAREHOUSE = "warehouse",
  BRANCH = "branch",
}

export enum StockMovementType {
  OPENING = "opening",
  RECEIPT = "receipt",
  SALE = "sale",
  ADJUSTMENT = "adjustment",
  TRANSFER_IN = "transfer_in",
  TRANSFER_OUT = "transfer_out",
  DAMAGE = "damage",
  RETURN = "return",
  REVERSAL = "reversal",
}

export enum SaleStatus {
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentStatus {
  PAID = "paid",
  PARTIAL = "partial",
  CREDIT = "credit",
}

export enum PaymentMethod {
  CASH = "cash",
  TRANSFER = "transfer",
  POS = "pos",
  CREDIT = "credit",
}

export enum PurchaseStatus {
  PENDING = "pending",
  PARTIAL = "partial",
  RECEIVED = "received",
  CANCELLED = "cancelled",
}

export enum TransferStatus {
  PENDING = "pending",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PendingActionType {
  SALE = "sale",
  STOCK_RECEIPT = "stock_receipt",
  STOCK_TRANSFER = "stock_transfer",
  STOCK_ADJUSTMENT = "stock_adjustment",
}

export enum PendingActionStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export enum SaleSource {
  WEB = "web",
  WHATSAPP = "whatsapp",
}

export enum StocktakeStatus {
  DRAFT = "draft",
  COUNTING = "counting",
  PENDING_APPROVAL = "pending_approval",
  APPLIED = "applied",
  CANCELLED = "cancelled",
}

/** Alias aligned with Prisma `StockTransferStatus`. */
export enum StockTransferStatus {
  PENDING = "pending",
  IN_TRANSIT = "in_transit",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
