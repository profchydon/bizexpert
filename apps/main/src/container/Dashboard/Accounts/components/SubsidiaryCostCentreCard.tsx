import type { UiCostCentreSpendRow } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityCostCentreSpend";
import { cn } from "@/lib/utils";
import type { Subsidiary } from "../types";
import { formatCurrencyAmount } from "../utils/formatCurrencyAmount";
import {
  COST_CENTRE_SCROLL_ROW_LIMIT,
  costCentreSpendListClass,
  costCentreSpendListScrollClass,
  costCentreSpendTotalClass,
  detailCardClass,
  detailCardTitleClass,
  detailRowClass,
} from "./detailCardClasses";

function formatSpendAmount(currency: string, value: number) {
  return formatCurrencyAmount(currency, value);
}

export function SubsidiaryCostCentreCard({
  subsidiary,
  spendRows,
  totalThisMonth,
}: {
  subsidiary: Subsidiary;
  spendRows: UiCostCentreSpendRow[];
  totalThisMonth: number;
}) {
  const currency = subsidiary.currency;
  const isScrollable = spendRows.length > COST_CENTRE_SCROLL_ROW_LIMIT;
  const entityCountLabel =
    spendRows.length === 1 ? "1 entity" : `${spendRows.length} entities`;

  return (
    <section className={detailCardClass}>
      <h2 className={detailCardTitleClass}>Cost-centre spend</h2>
      <p className="mt-1 text-sm text-gray-600">
        {entityCountLabel} billed through {subsidiary.name}. This spend is
        itemised on {subsidiary.name}&apos;s invoice.
      </p>
      <div className="mt-3">
        <div
          className={cn(
            costCentreSpendListClass,
            isScrollable && costCentreSpendListScrollClass,
          )}
        >
          {spendRows.map((row) => (
            <div key={row.id} className={detailRowClass}>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {row.name}
                </span>
                <span className="text-xs text-gray-600">{row.region}</span>
              </div>
              <span className="shrink-0 text-sm font-medium text-gray-900">
                {formatSpendAmount(currency, row.spendThisMonth)}
              </span>
            </div>
          ))}
        </div>
        <div className={costCentreSpendTotalClass}>
          <span className="text-sm font-semibold text-gray-900">
            Total this month
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {formatSpendAmount(currency, totalThisMonth)}
          </span>
        </div>
      </div>
    </section>
  );
}
