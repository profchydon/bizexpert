import {
  Banknote,
  ListOrdered,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { PaymentListMetric } from "./paymentListMetrics";
import {
  paymentsMetricCardClass,
  paymentsMetricGridClass,
  paymentsMetricHintClass,
  paymentsMetricIconClass,
  paymentsMetricTitleClass,
  paymentsMetricValueClass,
} from "./paymentsPageClasses";

const ICONS: Record<string, LucideIcon> = {
  received: Banknote,
  count: ListOrdered,
  average: TrendingUp,
};

export function PaymentsMetricCards({
  metrics,
}: {
  metrics: PaymentListMetric[];
}) {
  return (
    <div className={paymentsMetricGridClass}>
      {metrics.map((metric) => {
        const Icon = ICONS[metric.id] ?? Banknote;
        return (
          <article key={metric.id} className={paymentsMetricCardClass}>
            <div className="flex items-center gap-3">
              <span className={paymentsMetricIconClass}>
                <Icon className="size-5" />
              </span>
              <p className={paymentsMetricTitleClass}>{metric.title}</p>
            </div>
            <p className={paymentsMetricValueClass}>{metric.value}</p>
            {metric.hint ? (
              <p className={paymentsMetricHintClass}>{metric.hint}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
