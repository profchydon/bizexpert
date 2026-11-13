import { CheckCircle, Package, Truck01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface Props {
  deviceCount: number;
  country: string;
  onViewReceipt: () => void;
  isReceiptLoading?: boolean;
  onBackToStorage: () => void;
  isBackLoading?: boolean;
}

export function ImportSuccess({
  deviceCount,
  country,
  onViewReceipt,
  isReceiptLoading,
  onBackToStorage,
  isBackLoading,
}: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-10 text-center">
      <FeaturedIcon
        icon={CheckCircle}
        size="xl"
        color="success"
        theme="light"
      />
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-primary">
          Import request submitted
        </h2>
        <p className="text-sm text-tertiary">
          We&apos;ll arrange collection and let you know when your devices
          arrive. Track progress in the Requests tab.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-xl border border-secondary bg-primary p-4 text-left">
        <div className="flex items-center gap-3">
          <Package className="size-5 shrink-0 text-fg-quaternary" />
          <span className="text-sm text-secondary">
            <span className="font-semibold text-primary">{deviceCount}</span>{" "}
            device{deviceCount === 1 ? "" : "s"} to import from{" "}
            <span className="font-semibold text-primary">{country}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 border-t border-secondary pt-3">
          <Truck01 className="size-5 shrink-0 text-fg-quaternary" />
          <span className="text-sm text-secondary">
            Rayda coordinates the pickup — view the receipt once the devices are
            checked in.
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Button
          size="md"
          iconLeading={CheckCircle}
          isLoading={isReceiptLoading}
          onClick={onViewReceipt}
          className="w-full"
          data-testid="importsuccess-button"
        >
          View inventory receipt
        </Button>
        <Button
          size="md"
          color="secondary"
          isLoading={isBackLoading}
          onClick={onBackToStorage}
          className="w-full"
          data-testid="importsuccess-button-2"
        >
          Back to storage
        </Button>
      </div>
    </div>
  );
}
