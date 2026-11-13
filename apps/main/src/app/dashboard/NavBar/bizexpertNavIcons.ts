import {
  Boxes,
  CircleMinus,
  FolderTree,
  LayoutDashboard,
  MapPin,
  Package,
  ScanBarcode,
  Settings,
  Contact,
  Blocks,
  Banknote,
  ListOrdered,
  ShoppingCart,
  TrendingUp,
  Truck,
  Wallet,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  inventory: Boxes,
  stores: MapPin,
  categories: FolderTree,
  products: Package,
  stock: Warehouse,
  "track-item": ScanBarcode,
  "stock-removals": CircleMinus,
  customers: Contact,
  integrations: Blocks,
  sales: ShoppingCart,
  payments: Banknote,
  "payment-list": Banknote,
  "payment-transactions": ListOrdered,
  "cashflow-analytics": Wallet,
  "customer-analytics": TrendingUp,
  purchases: Truck,
  team: Users,
  settings: Settings,
};

export function bizexpertNavIcon(id: string): LucideIcon {
  return ICONS[id] ?? LayoutDashboard;
}

export function bizexpertNavIconIds(): string[] {
  return Object.keys(ICONS);
}
