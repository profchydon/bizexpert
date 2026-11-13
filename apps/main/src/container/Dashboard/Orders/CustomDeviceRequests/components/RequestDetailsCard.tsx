import type { CustomDeviceRequest } from "../types";
import CountryFlag from "./CountryFlag";

interface RequestDetailsCardProps {
  request: CustomDeviceRequest;
}

export default function RequestDetailsCard({
  request,
}: Readonly<RequestDetailsCardProps>) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <span className="text-sm font-semibold text-gray-800">
        Request Details
      </span>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500">Country</span>
          <div className="flex items-center gap-1.5">
            <CountryFlag country={request.country} code={request.countryCode} />
            <span className="text-sm text-gray-600">{request.country}</span>
          </div>
        </div>

        {request.createdAt && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Submitted</span>
            <span className="text-sm text-gray-600">{request.createdAt}</span>
          </div>
        )}

        {request.approvedAt && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Approved</span>
            <span className="text-sm text-gray-600">{request.approvedAt}</span>
          </div>
        )}

        {request.expiresAt && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">
              {request.status === "expired" ? "Expired On" : "Quote Expires"}
            </span>
            <span
              className={
                request.status === "waiting_for_action"
                  ? "text-sm font-medium text-red-600"
                  : "text-sm text-gray-600"
              }
            >
              {request.expiresAt}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
