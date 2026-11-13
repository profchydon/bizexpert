import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type CheckoutWalletCardProps = {
  currencySymbol: string;
  available: string;
  limit: string;
  usedPercent: number;
  note?: string;
};

const CheckoutWalletCard = ({
  currencySymbol,
  available,
  limit,
  usedPercent,
  note,
}: CheckoutWalletCardProps) => {
  return (
    <div
      className={cn("flex flex-col rounded-xl bg-brand-solid p-4 text-white")}
    >
      <div className="rounded-lg border border-white/50 bg-white/30 p-4">
        <p className="text-sm font-medium text-white">
          Available credit balance
        </p>
        <p className="my-2 text-2xl font-semibold text-white">
          {currencySymbol}
          {available}
        </p>
        <div className="flex min-w-0 flex-row items-center gap-3">
          <Progress
            indicatorClassName="bg-brand-solid"
            value={usedPercent}
            className="h-2 w-full"
          />
          <p className="shrink-0 text-sm font-medium text-white">
            {currencySymbol}
            {limit}
          </p>
        </div>
        {note ? (
          <p className="mt-3 text-sm font-medium text-white">{note}</p>
        ) : null}
      </div>
    </div>
  );
};

export default CheckoutWalletCard;
