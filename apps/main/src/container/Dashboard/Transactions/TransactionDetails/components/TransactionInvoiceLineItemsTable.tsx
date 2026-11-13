import { Badge } from "@/components/base/badges/badges";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatAmount from "@/utils/formatAmount";
import { formatTaxRatePercent } from "@/lib/tax/lineVat";
import { TransactionTypeBadge } from "../../components/TransactionTypeBadges";
import { TransactionInvoiceLine } from "../transactionInvoiceViewModel";

interface Props {
  lines: TransactionInvoiceLine[];
  currencySymbol: string;
  vatColumnLabel: string;
}

const renderTypeBadge = (line: TransactionInvoiceLine) => {
  if (line.isServiceFee) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Badge color="gray" size="sm" type="pill-color">
                Service fee
              </Badge>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Rayda service charge for this order.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <TransactionTypeBadge type={line.type} />;
};

const TransactionInvoiceLineItemsTable = ({
  lines,
  currencySymbol,
  vatColumnLabel,
}: Props) => {
  const money = (value: number) => `${currencySymbol}${formatAmount(value)}`;

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Unit price</TableHead>
            <TableHead>{vatColumnLabel}</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.length > 0 ? (
            lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>
                  <span className="block max-w-[280px] truncate text-sm font-medium text-primary">
                    {line.name}
                  </span>
                  {line.country ? (
                    <span className="text-xs text-tertiary">
                      {line.country}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell>{renderTypeBadge(line)}</TableCell>
                <TableCell className="tabular-nums">{line.quantity}</TableCell>
                <TableCell className="tabular-nums text-tertiary">
                  {line.unitPrice === 0 ? (
                    <span className="text-tertiary">—</span>
                  ) : (
                    money(line.unitPrice)
                  )}
                </TableCell>
                <TableCell className="tabular-nums text-secondary">
                  <span className="flex flex-col leading-tight">
                    <span>{money(line.vatAmount)}</span>
                    {line.vatRate > 0 ? (
                      <span className="text-xs text-quaternary">
                        {formatTaxRatePercent(line.vatRate)}
                      </span>
                    ) : null}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums text-primary">
                  {money(line.netAmount)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-sm text-tertiary"
              >
                No invoice line items available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionInvoiceLineItemsTable;
