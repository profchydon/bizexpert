import {
  Banknote,
  CreditCard,
  ListOrdered,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { SalesListMetric } from "./saleListMetrics";
import {
  salesMetricCardClass,
  salesMetricGridClass,
  salesMetricHintClass,
  salesMetricIconClass,
  salesMetricTitleClass,
  salesMetricValueClass,
} from "./salesPageClasses";

const ICONS: Record<string, LucideIcon> = {
  revenue: Banknote,
  profit: TrendingUp,
  credit: CreditCard,
  aov: ListOrdered,
};

export function SalesMetricCards({ metrics }: { metrics: SalesListMetric[] }) {
  return (
    <div className={salesMetricGridClass}>
      {metrics.map((metric) => {
        const Icon = ICONS[metric.id] ?? Banknote;
        return (
          <article key={metric.id} className={salesMetricCardClass}>
            <div className="flex items-center gap-3">
              <span className={salesMetricIconClass}>
                <Icon className="size-5" />
              </span>
              <p className={salesMetricTitleClass}>{metric.title}</p>
            </div>
            <p className={salesMetricValueClass}>{metric.value}</p>
            {metric.hint ? (
              <p className={salesMetricHintClass}>{metric.hint}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
