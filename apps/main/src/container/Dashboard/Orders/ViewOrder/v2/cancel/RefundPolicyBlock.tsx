"use client";

const OFFBOARD_RULES: { text: string; boxOnly?: boolean }[] = [
  {
    text: "Any work already carried out. It is charged once its step shows as done on the device timeline.",
  },
  {
    text: "The off-boarding coordination fee, once a pickup has been scheduled.",
  },
  {
    text: "The shipping box, once it has been delivered to the employee.",
    boxOnly: true,
  },
  {
    text: "Devices a vendor has already collected. Once your device is in their hands it cannot be cancelled, only sent back.",
  },
];

export function RefundPolicyBlock({ hasBox }: { hasBox: boolean }) {
  const rules = OFFBOARD_RULES.filter((rule) => !rule.boxOnly || hasBox);
  return (
    <div className="rounded-xl border border-secondary bg-secondary px-3.5 py-3">
      <p className="text-xs font-semibold text-secondary">
        What is not refunded
      </p>
      <p className="mt-1 text-xs text-tertiary">
        Off-boarding is billed as a service, so cancelling returns the service
        charges that have not been used yet.
      </p>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {rules.map((rule) => (
          <li key={rule.text} className="flex gap-2 text-xs text-tertiary">
            <span
              aria-hidden
              className="mt-1.5 size-1 shrink-0 rounded-full bg-fg-quaternary"
            />
            <span>{rule.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
