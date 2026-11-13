function TrackingField({
  label,
  value,
  href,
}: Readonly<{
  label: string;
  value: string;
  href?: string;
}>) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-[#475467]">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm text-[#475467]">{value || "—"}</p>
      )}
    </div>
  );
}

interface Props {
  trackingNo: string;
  externalTrackingLink: string;
  courierName: string;
}

export default function ReferenceSlideoutTracking({
  trackingNo,
  externalTrackingLink,
  courierName,
}: Readonly<Props>) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#eaecf0] px-6 py-4">
      <TrackingField
        label="Tracking number"
        value={trackingNo}
        href={trackingNo ? `/track/${trackingNo}` : undefined}
      />
      <TrackingField
        label="External tracking link"
        value={externalTrackingLink}
        href={externalTrackingLink || undefined}
      />
      <TrackingField label="Courier" value={courierName} />
    </div>
  );
}
