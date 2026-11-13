import type { ReactNode } from "react";
import type { AdminRole, Subsidiary } from "../types";
import { BillingModeBadge } from "./BillingModeBadge";
import {
  detailCardBodyClass,
  detailCardClass,
  detailCardTitleClass,
  detailRowClass,
  detailRowLabelClass,
  detailRowValueClass,
} from "./detailCardClasses";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={`${detailRowClass} items-start`}>
      <span className={detailRowLabelClass}>{label}</span>
      <span className={detailRowValueClass}>{value}</span>
    </div>
  );
}

export function SubsidiaryBillingCard({
  subsidiary,
  actingRole,
}: {
  subsidiary: Subsidiary;
  actingRole: AdminRole;
}) {
  const delegated = subsidiary.billingMode === "delegated";
  const entity = subsidiary.billingEntityName;
  const restricted = delegated && actingRole !== "global";

  return (
    <section className={detailCardClass}>
      <h2 className={detailCardTitleClass}>Billing arrangement</h2>
      <div className={detailCardBodyClass}>
        <Row
          label="Billing mode"
          value={<BillingModeBadge mode={subsidiary.billingMode} />}
        />
        {delegated && <Row label="Billed by" value={entity} />}
        <Row
          label="Invoice"
          value={
            delegated
              ? `Issued to ${entity}. This entity is a cost-centre reference.`
              : "Issued to this entity."
          }
        />
        <Row
          label="Payment method"
          value={
            delegated
              ? `Covered by ${entity}'s method`
              : subsidiary.cardOnFile
                ? "Own card on file"
                : "No card captured"
          }
        />
        {delegated && subsidiary.billingConfirmedAt && (
          <Row
            label="Delegation confirmed"
            value={`${subsidiary.billingConfirmedAt}${
              subsidiary.billingConfirmedBy
                ? ` by ${subsidiary.billingConfirmedBy}`
                : ""
            }`}
          />
        )}
      </div>
      {restricted && (
        <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          Billing is managed by {entity}. Payment and invoice settings
          aren&apos;t available here.
        </p>
      )}
    </section>
  );
}
