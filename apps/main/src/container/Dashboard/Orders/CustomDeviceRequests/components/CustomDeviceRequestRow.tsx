import type { CustomDeviceRequest } from "../types";
import { calculateBudgetTotal, formatCurrency } from "../utils";
import CountryFlag from "./CountryFlag";
import RFQDeviceCount from "./RFQDeviceCount";
import StatusBadge from "./StatusBadge";

interface CustomDeviceRequestRowProps {
  request: CustomDeviceRequest;
  onView: (request: CustomDeviceRequest) => void;
}

export default function CustomDeviceRequestRow({
  request,
  onView,
}: Readonly<CustomDeviceRequestRowProps>) {
  const budgetTotal = calculateBudgetTotal(request);

  return (
    <tr className="border-b transition-colors hover:bg-gray-50">
      <td className="p-4 font-medium text-gray-900">{request.id}</td>
      <td className="p-4">
        <RFQDeviceCount devices={request.devices} />
      </td>
      <td className="p-4 text-gray-900">
        {budgetTotal
          ? formatCurrency(budgetTotal.total, request.currency)
          : "—"}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1.5">
          <CountryFlag country={request.country} code={request.countryCode} />
          <span className="text-gray-600">{request.country}</span>
        </div>
      </td>
      <td className="p-4">
        <StatusBadge status={request.status} />
      </td>
      <td className="p-4 text-gray-900">
        {request.requiredBudget
          ? formatCurrency(request.requiredBudget, request.currency)
          : "—"}
      </td>
      <td className="p-4">
        <button
          type="button"
          className="text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800 hover:underline"
          onClick={() => onView(request)}
        >
          View
        </button>
      </td>
    </tr>
  );
}
