import Link from "next/link";
import { Badge } from "@/components/base/badges/badges";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useListDetailHref } from "@/hooks/tableListLocation";
import routes from "@/routes";
import { UNMAPPED_SUBSIDIARY_STATUS, type Subsidiary } from "../types";
import { CURRENCY_TOOLTIP } from "../utils/badgeTooltips";
import { PrimaryBadge } from "./PrimaryBadge";
import { SubsidiaryRowActions } from "./SubsidiaryRowActions";
import { SubsidiaryStatusBadge } from "./SubsidiaryStatusBadge";
import {
  subsidiaryStickyActionCellClass,
  subsidiaryTableCellClass,
  subsidiaryTableRowClass,
} from "./subsidiaryStickyActionColumn";

export function SubsidiaryTableRow({ subsidiary }: { subsidiary: Subsidiary }) {
  const href = useListDetailHref(routes.SUBSIDIARY_DETAIL(subsidiary.id));

  return (
    <TableRow className={subsidiaryTableRowClass}>
      <TableCell className={subsidiaryTableCellClass}>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={href}
            className="font-medium text-primary-700 hover:underline"
          >
            {subsidiary.name}
          </Link>
          {subsidiary.isPrimary ? (
            <PrimaryBadge className="self-center" />
          ) : null}
        </div>
      </TableCell>
      <TableCell className={`${subsidiaryTableCellClass} text-gray-600`}>
        {subsidiary.region}
      </TableCell>
      <TableCell className={subsidiaryTableCellClass}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">
                <Badge color="gray" size="sm" type="pill-color">
                  {subsidiary.currency}
                </Badge>
              </span>
            </TooltipTrigger>
            <TooltipContent>{CURRENCY_TOOLTIP}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell
        className={`${subsidiaryTableCellClass} tabular-nums text-gray-700`}
      >
        {subsidiary.officesCount}
      </TableCell>
      <TableCell className={subsidiaryTableCellClass}>
        {subsidiary.status === UNMAPPED_SUBSIDIARY_STATUS ? (
          <span className="text-gray-500">—</span>
        ) : (
          <SubsidiaryStatusBadge status={subsidiary.status} />
        )}
      </TableCell>
      <TableCell
        className={`${subsidiaryTableCellClass} ${subsidiaryStickyActionCellClass}`}
      >
        <SubsidiaryRowActions subsidiary={subsidiary} />
      </TableCell>
    </TableRow>
  );
}
