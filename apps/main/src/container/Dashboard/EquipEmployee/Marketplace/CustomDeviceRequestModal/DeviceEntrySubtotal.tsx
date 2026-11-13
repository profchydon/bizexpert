import { cn } from "@/lib/utils";
import type { DeviceEntry } from "./types";

function DeviceEntrySubtotal({
  className,
  device,
  emptyLabel,
}: Readonly<{
  className?: string;
  device: DeviceEntry;
  emptyLabel?: string;
}>) {
  const quantity = Number.parseInt(device.quantity, 10);
  const budget = Number.parseInt(device.budgetPrice, 10);

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-gray-600">Subtotal</span>
      {device.budgetPrice && device.quantity ? (
        <span className="text-gray-600">
          {budget.toLocaleString()} × {device.quantity} ={" "}
          <span className="font-semibold text-gray-900">
            {(budget * quantity).toLocaleString()}
          </span>
        </span>
      ) : (
        <span className="text-gray-600 italic">
          {emptyLabel ?? "No budget added"}
        </span>
      )}
    </div>
  );
}

export { DeviceEntrySubtotal };
