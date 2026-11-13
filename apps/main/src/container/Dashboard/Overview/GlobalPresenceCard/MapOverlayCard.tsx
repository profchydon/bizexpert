type MapOverlayCardProps = {
  title?: string;
  subtitle?: string;
};

export function MapOverlayCard({
  title = "Global presence",
  subtitle = "Hover over a country to see employee, equipment, and storage details.",
}: MapOverlayCardProps) {
  return (
    <div className="absolute top-4 left-4 z-10 max-w-[320px] rounded-xl border border-border-secondary bg-primary p-4 shadow-md">
      <p className="text-lg font-semibold text-primary">{title}</p>
      <p className="mt-0.5 text-sm text-tertiary">{subtitle}</p>
    </div>
  );
}
