type Props = {
  title: string;
  description: string;
};

export function DashboardSectionPlaceholder({ title, description }: Props) {
  return (
    <div className="flex flex-col gap-2 py-6 lg:py-8">
      <h1 className="text-2xl font-semibold text-primary">{title}</h1>
      <p className="text-sm text-tertiary">{description}</p>
      <div className="mt-6 rounded-xl border border-dashed border-border-secondary bg-primary px-6 py-12 text-center text-sm text-secondary">
        This section is being wired to the BizExpert API next.
      </div>
    </div>
  );
}
