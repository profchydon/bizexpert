import {
  Banknote,
  Boxes,
  CreditCard,
  ListOrdered,
  ShoppingCart,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  inventoryOverviewMetricCardClass,
  inventoryOverviewMetricGridClass,
  inventoryOverviewMetricHintClass,
  inventoryOverviewMetricIconClass,
  inventoryOverviewMetricTitleClass,
  inventoryOverviewMetricValueClass,
} from "./inventoryOverviewClasses";
import type { InventoryOverviewMetric } from "./inventoryOverviewTypes";

const ICONS: Record<string, LucideIcon> = {
  revenue: Banknote,
  profit: TrendingUp,
  cash: Wallet,
  inventory: Boxes,
  credit: CreditCard,
  sales: ShoppingCart,
  aov: ListOrdered,
};

export function InventoryMetricCards({
  metrics,
}: {
  metrics: InventoryOverviewMetric[];
}) {
  return (
    <div className={inventoryOverviewMetricGridClass}>
      {metrics.map((metric) => {
        const Icon = ICONS[metric.id] ?? Banknote;
        return (
          <article key={metric.id} className={inventoryOverviewMetricCardClass}>
            <div className="flex items-center gap-3">
              <span className={inventoryOverviewMetricIconClass}>
                <Icon className="size-5" />
              </span>
              <p className={inventoryOverviewMetricTitleClass}>
                {metric.title}
              </p>
            </div>
            <p className={inventoryOverviewMetricValueClass}>{metric.value}</p>
            {metric.hint ? (
              <p className={inventoryOverviewMetricHintClass}>{metric.hint}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
