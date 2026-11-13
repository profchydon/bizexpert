export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
      <p className="text-lg font-semibold text-primary">Hover to see details</p>
      <div className="flex items-center gap-2 rounded-full border border-border-secondary bg-primary px-6 py-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
          <span className="size-2 rounded-full bg-brand-secondary" />
          Active
        </span>
        <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
          <span className="size-2 rounded-full bg-quaternary" />
          Inactive
        </span>
      </div>
    </div>
  );
}
