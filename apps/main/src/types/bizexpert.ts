export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  isActive: boolean;
  locations?: Location[];
}

export type LocationType = "shop" | "warehouse" | "branch";

export interface Location {
  id: string;
  businessId: string;
  name: string;
  type: LocationType;
  businessType?: string | null;
  vatRate?: number | string | null;
  address?: string;
  phone?: string;
  isDefault: boolean;
  isActive: boolean;
}

export type BusinessRole =
  | "owner"
  | "admin"
  | "business_manager"
  | "store_keeper"
  | "developer"
  | "customer_support"
  | "waybill_manager"
  | "sales_cashier"
  | "cashier"
  | "store_manager"
  | "accountant";

export interface BusinessMember {
  id: string;
  userId: string;
  role: BusinessRole;
  isActive: boolean;
  user?: User;
}

export interface LocationStaff {
  id: string;
  userId: string;
  canSell: boolean;
  canReceiveStock: boolean;
  canTransferStock: boolean;
  canViewAnalytics: boolean;
  user?: User;
}

export interface Category {
  id: string;
  businessId: string;
  parentId?: string | null;
  parentName?: string | null;
  name: string;
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductUnit {
  id: string;
  productId: string;
  unitName: string;
  conversionFactor: number | string;
  sellingPrice?: number | string | null;
}

export type ProductKind = "product" | "service";

export interface Product {
  id: string;
  businessId: string;
  name: string;
  kind?: ProductKind;
  hasVariants?: boolean;
  sku?: string;
  barcode?: string;
  category?: string;
  subCategory?: string;
  description?: string;
  imageUrl?: string;
  sellingPrice: number | string;
  purchaseCost: number | string;
  baseUnit: string;
  lowStockThreshold: number | string;
  isActive: boolean;
  variantCount?: number;
  totalStock?: number;
  variants?: Product[];
  locationIds?: string[];
  productUnits?: ProductUnit[];
}

export interface InventoryBalance {
  id: string;
  productId: string;
  locationId: string;
  quantity: number | string;
  averageCost: number | string;
  totalValue: number | string;
  product?: Product;
  location?: Location;
}

export interface StockMovement {
  id: string;
  type: string;
  quantity: number | string;
  createdAt: string;
  locationId?: string;
  reason?: string | null;
  unitCost?: number | string | null;
  totalCost?: number | string | null;
  product?: Pick<Product, "name">;
  location?: Pick<Location, "name">;
}

export type StockTransferStatus =
  "pending" | "in_transit" | "completed" | "cancelled";

export interface StockTransfer {
  id: string;
  transferNumber: string;
  status: StockTransferStatus;
  sourceLocation?: Pick<Location, "id" | "name">;
  destinationLocation?: Pick<Location, "id" | "name">;
  createdAt: string;
}

export type StocktakeStatus =
  "draft" | "counting" | "pending_approval" | "applied" | "cancelled";

export interface StocktakeLine {
  id: string;
  productId: string;
  productName: string;
  systemQuantity: number | string;
  countedQuantity: number | string | null;
  varianceQuantity: number | string | null;
}

export interface Stocktake {
  id: string;
  stocktakeNumber: string;
  status: StocktakeStatus;
  locationId: string;
  location?: Pick<Location, "name">;
  lines?: StocktakeLine[];
}

export interface WhatsappIdentity {
  id: string;
  userId: string;
  businessId: string;
  whatsappPhone: string;
  isVerified: boolean;
  defaultLocationId?: string | null;
}

export type {
  Customer,
  CustomerLedger,
  CustomerLedgerType,
  CustomerSale,
} from "./customer";

export type {
  PaymentListItem,
  PaymentMethod,
  PaymentStatus,
  PaymentsListResponse,
  Sale,
  SaleItem,
  SalePayment,
  SaleSource,
  SaleStatus,
  SalesListResponse,
} from "./sale";
