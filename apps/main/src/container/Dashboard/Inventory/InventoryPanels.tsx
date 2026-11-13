"use client";

import type {
  InventoryBalance,
  StockMovement,
  Stocktake,
  StockTransfer,
} from "@/types/bizexpert";
import { BalancesTable } from "./BalancesTable";
import type { InventoryTab } from "./inventoryTabs";
import { MovementsTable } from "./MovementsTable";
import { StocktakesTable } from "./StocktakesTable";
import { TransfersTable } from "./TransfersTable";

type Props = {
  tab: InventoryTab;
  search: string;
  onSearch: (value: string) => void;
  balances?: InventoryBalance[];
  balancesLoading: boolean;
  balancesError: boolean;
  transfers?: StockTransfer[];
  transfersLoading: boolean;
  transfersError: boolean;
  movements?: StockMovement[];
  movementsLoading: boolean;
  movementsError: boolean;
  stocktakes?: Stocktake[];
  stocktakesLoading: boolean;
  stocktakesError: boolean;
  onReceive: () => void;
  onTransfer: () => void;
  onReceiveTransfer: (id: string) => void;
  onCancelTransfer: (item: StockTransfer) => void;
  onStartStocktake: () => void;
  stocktakeLoading: boolean;
  canStartStocktake: boolean;
};

export function InventoryPanels(props: Props) {
  if (props.tab === "balances") {
    return (
      <BalancesTable
        rows={props.balances}
        isLoading={props.balancesLoading}
        isError={props.balancesError}
        search={props.search}
        onSearch={props.onSearch}
        onReceive={props.onReceive}
      />
    );
  }
  if (props.tab === "transfers") {
    return (
      <TransfersTable
        rows={props.transfers}
        isLoading={props.transfersLoading}
        isError={props.transfersError}
        search={props.search}
        onSearch={props.onSearch}
        onTransfer={props.onTransfer}
        onReceive={props.onReceiveTransfer}
        onCancel={props.onCancelTransfer}
      />
    );
  }
  if (props.tab === "movements") {
    return (
      <MovementsTable
        rows={props.movements}
        isLoading={props.movementsLoading}
        isError={props.movementsError}
        search={props.search}
        onSearch={props.onSearch}
      />
    );
  }
  return (
    <StocktakesTable
      rows={props.stocktakes}
      isLoading={props.stocktakesLoading}
      isError={props.stocktakesError}
      search={props.search}
      onSearch={props.onSearch}
      onStart={props.onStartStocktake}
      startLoading={props.stocktakeLoading}
      canStart={props.canStartStocktake}
    />
  );
}
