export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-tertiary uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-3 rounded-lg border border-secondary bg-primary p-4">
        {children}
      </div>
    </section>
  );
}

export function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm text-tertiary">{label}</span>
      <div className="text-right text-sm font-medium text-primary">
        {children}
      </div>
    </div>
  );
}
