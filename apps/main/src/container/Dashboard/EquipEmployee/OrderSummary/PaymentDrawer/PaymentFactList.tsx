import { cx } from "@/utils/cx";

export interface PaymentFact {
  id: string;
  label: string;
  value: string;
}

export function PaymentFactList({ facts }: { facts: PaymentFact[] }) {
  return (
    <dl className="flex flex-col">
      {facts.map((fact, index) => (
        <div
          key={fact.id}
          className={cx(
            "flex items-center gap-3 py-2",
            index > 0 && "border-t border-secondary",
          )}
        >
          <dt className="text-xs text-tertiary">{fact.label}</dt>
          <dd className="ml-auto text-right text-xs font-semibold text-primary">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
