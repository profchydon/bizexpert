import type { RFQDevice } from "../types";
import { formatCurrency } from "../utils";

function formatSpecificationLabel(key: string) {
  if (key === "RAM") return "RAM";

  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DeviceSpecificationList({
  specification,
}: Readonly<{ specification?: Record<string, string> }>) {
  const entries = Object.entries(specification ?? {}).filter(
    ([key, value]) => key.trim() && String(value).trim(),
  );

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-500">
        Specifications
      </span>
      <div className="flex flex-wrap gap-1.5">
        {entries.map(([key, value]) => (
          <span
            key={key}
            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-700"
          >
            <span className="font-medium">
              {formatSpecificationLabel(key)}:
            </span>{" "}
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function VendorResponseBlock({
  currency,
  device,
  quotedPrice,
}: Readonly<{
  currency?: string;
  device: RFQDevice;
  quotedPrice: number | null;
}>) {
  const response = device.vendorResponse;
  if (!response) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="h-px bg-gray-200" />
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Vendor Response
      </span>

      {quotedPrice !== null && (
        <div className="rounded-lg border border-success-200 bg-success-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-success-700">
              Quoted Price
            </span>
            <span className="text-sm font-semibold text-success-700">
              {formatCurrency(quotedPrice, currency)} /unit
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-success-200 pt-2">
            <span className="text-sm font-medium text-success-700">
              Total ({device.quantity} units)
            </span>
            <span className="text-sm font-bold text-success-700">
              {formatCurrency(quotedPrice * device.quantity, currency)}
            </span>
          </div>
        </div>
      )}

      {response.type === "alternative" && response.alternative && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-3">
          <span className="text-xs font-medium text-primary-700">
            Suggested Alternative
          </span>
          <p className="text-sm font-semibold text-primary-700">
            {response.alternative.name}
          </p>
          {response.alternative.specs && (
            <p className="text-xs text-primary-700">
              {response.alternative.specs}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-primary-200 pt-2">
            <span className="text-sm font-medium text-primary-700">
              Price ({device.quantity} units)
            </span>
            <span className="text-sm font-bold text-primary-700">
              {formatCurrency(
                response.alternative.price * device.quantity,
                currency,
              )}
            </span>
          </div>
        </div>
      )}

      {response.type === "unavailable" && (
        <div className="rounded-lg border border-error-200 bg-error-50 p-3">
          <span className="text-sm font-semibold text-error-700">
            Device unavailable
          </span>
          {response.unavailableReason && (
            <p className="mt-1 text-sm leading-5 text-error-700">
              {response.unavailableReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function RequestedDeviceExpandedContent({
  budgetTotal,
  currency,
  device,
  hasUnitPrice,
  quotedPrice,
  unitPrice,
}: Readonly<{
  budgetTotal: number | null;
  currency?: string;
  device: RFQDevice;
  hasUnitPrice: boolean;
  quotedPrice: number | null;
  unitPrice: number | null;
}>) {
  return (
    <div className="flex flex-col gap-4 px-3 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="h-px bg-gray-200" />
      <div className="grid grid-cols-2 gap-3">
        <DetailItem
          label="Your Budget"
          value={
            unitPrice ? formatCurrency(unitPrice, currency) : "Not specified"
          }
        />
        <DetailItem label="Quantity" value={device.quantity} />
        <DetailItem
          label="Asset Type"
          value={device.assetTypeName ?? device.assetType}
        />
        <DetailItem
          label="Budget Subtotal"
          value={
            hasUnitPrice && budgetTotal
              ? formatCurrency(budgetTotal, currency)
              : "—"
          }
        />
      </div>

      <VendorResponseBlock
        currency={currency}
        device={device}
        quotedPrice={quotedPrice}
      />

      <DeviceSpecificationList specification={device.specification} />

      {device.description && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-gray-500">Description</span>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {device.description}
          </p>
        </div>
      )}
    </div>
  );
}

function DetailItem({
  label,
  value,
}: Readonly<{ label: string; value: number | string }>) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

export { RequestedDeviceExpandedContent };
