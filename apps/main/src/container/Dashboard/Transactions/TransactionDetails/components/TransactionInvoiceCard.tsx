import { TableCard } from "@/components/application/table/table";
import { ITransactionDetail } from "@/types/transactions";
import { buildTransactionInvoiceViewModel } from "../transactionInvoiceViewModel";
import TransactionInvoiceFees from "./TransactionInvoiceFees";
import TransactionInvoiceLineItemsTable from "./TransactionInvoiceLineItemsTable";

interface Props {
  transaction?: ITransactionDetail;
}

const TransactionInvoiceCard = ({ transaction }: Props) => {
  const viewModel = buildTransactionInvoiceViewModel(transaction);
  const itemLabel = viewModel.itemCount === 1 ? "item" : "items";

  return (
    <TableCard.Root className="flex flex-1 flex-col">
      <TableCard.Header
        title="Invoice"
        description="Devices, fees, and totals captured for this transaction."
        badge={`${viewModel.itemCount} ${itemLabel}`}
      />
      <TransactionInvoiceLineItemsTable
        lines={viewModel.lines}
        currencySymbol={viewModel.currencySymbol}
        vatColumnLabel={viewModel.vatColumnLabel}
      />
      <TransactionInvoiceFees
        currencySymbol={viewModel.currencySymbol}
        totals={viewModel.totals}
      />
    </TableCard.Root>
  );
};

export default TransactionInvoiceCard;
