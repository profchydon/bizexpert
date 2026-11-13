"use client";

import { formatNgn } from "@/lib/bizexpert/format";
import type { InventoryBalance, Product } from "@/types/bizexpert";
import { ProductStatusBadge } from "../Products/ProductStatusBadge";
import {
  storesWithStock,
  totalBalanceQuantity,
  totalBalanceValue,
} from "./trackItemLookup";
import {
  trackItemFactGridClass,
  trackItemFactLabelClass,
  trackItemFactValueClass,
  trackItemMetricCardClass,
  trackItemMetricGridClass,
  trackItemMetricTitleClass,
  trackItemMetricValueClass,
  trackItemTableShellClass,
  trackItemTableTitleClass,
  trackItemTableToolbarClass,
} from "./trackItemPageClasses";

type Props = {
  product: Product;
  stock: InventoryBalance[];
};

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={trackItemFactLabelClass}>{label}</dt>
      <dd className={trackItemFactValueClass}>{value}</dd>
    </div>
  );
}

export function TrackItemSummary({ product, stock }: Props) {
  const category = [product.category, product.subCategory]
    .filter(Boolean)
    .join(" / ");

  return (
    <>
      <div className={trackItemMetricGridClass}>
        <div className={trackItemMetricCardClass}>
          <p className={trackItemMetricTitleClass}>On hand</p>
          <p className={trackItemMetricValueClass}>
            {totalBalanceQuantity(stock)}
          </p>
        </div>
        <div className={trackItemMetricCardClass}>
          <p className={trackItemMetricTitleClass}>Stores with stock</p>
          <p className={trackItemMetricValueClass}>{storesWithStock(stock)}</p>
        </div>
        <div className={trackItemMetricCardClass}>
          <p className={trackItemMetricTitleClass}>Stock value</p>
          <p className={trackItemMetricValueClass}>
            {formatNgn(totalBalanceValue(stock))}
          </p>
        </div>
      </div>
      <div className={trackItemTableShellClass}>
        <div className={trackItemTableToolbarClass}>
          <h3 className={trackItemTableTitleClass}>{product.name}</h3>
          <ProductStatusBadge isActive={product.isActive} />
        </div>
        <dl className={trackItemFactGridClass}>
          <Fact label="SKU" value={product.sku || "—"} />
          <Fact label="Barcode" value={product.barcode || "—"} />
          <Fact label="Category" value={category || "—"} />
          <Fact label="Unit" value={product.baseUnit} />
          <Fact label="Selling price" value={formatNgn(product.sellingPrice)} />
          <Fact label="Purchase cost" value={formatNgn(product.purchaseCost)} />
        </dl>
      </div>
    </>
  );
}
