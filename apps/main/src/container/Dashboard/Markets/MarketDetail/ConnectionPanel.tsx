"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MarketApp } from "../marketCatalog";
import type { MarketConnection } from "../marketStorage";
import { marketsTableShellClass } from "../marketsPageClasses";

type Props = {
  market: MarketApp;
  connection: MarketConnection;
  webhookUrl: string;
  mappedCount: number;
  productCount: number;
  onMapProducts: () => void;
  onDisconnect: () => void;
};

export function ConnectionPanel({
  market,
  connection,
  webhookUrl,
  mappedCount,
  productCount,
  onMapProducts,
  onDisconnect,
}: Props) {
  return (
    <div className={`${marketsTableShellClass} p-6`}>
      <h3 className="text-lg font-semibold text-gray-900">Connection</h3>
      <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-gray-500">{market.name} store</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {connection.remoteStoreName}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">BizExpert store</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {connection.locationName}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Mapped products</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {mappedCount} of {productCount}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Webhook URL</dt>
          <dd className="mt-1 break-all text-xs text-gray-700">{webhookUrl}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={async () => {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied");
          }}
        >
          Copy webhook URL
        </Button>
        <Button variant="outline" size="md" onClick={onMapProducts}>
          Map products
        </Button>
        <Button variant="destructive" size="md" onClick={onDisconnect}>
          Disconnect
        </Button>
      </div>
    </div>
  );
}
