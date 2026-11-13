import { ReactNode } from "react";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";

type Props = {
  isRefreshing: boolean;
  children: ReactNode;
};

const OrdersTableRefresh = ({ isRefreshing, children }: Props) => (
  <div className="relative" aria-busy={isRefreshing || undefined}>
    <div
      className={cn(
        isRefreshing && "pointer-events-none select-none opacity-40",
      )}
    >
      {children}
    </div>
    {isRefreshing ? (
      <div className="absolute inset-0 z-10 grid place-content-center bg-white/70">
        <Loader />
        <span className="sr-only">Loading orders</span>
      </div>
    ) : null}
  </div>
);

export default OrdersTableRefresh;
