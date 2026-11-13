"use client";

import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Office } from "../../types";
import { useListDetailHref } from "@/hooks/tableListLocation";
import { officeDetailHref } from "../utils/officeDetailHref";
import { PrimaryBadge } from "../../components/PrimaryBadge";
import { OfficeClosedBadge } from "./OfficeClosedBadge";
import { OfficeRowActions } from "./OfficeRowActions";
import {
  officeTableCellClass,
  subsidiaryStickyActionCellClass,
  subsidiaryTableRowClass,
} from "../../components/subsidiaryStickyActionColumn";

export function OfficeTableRow({ office }: { office: Office }) {
  const href = useListDetailHref(officeDetailHref(office));

  return (
    <TableRow className={subsidiaryTableRowClass}>
      <TableCell className={officeTableCellClass}>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={href}
            className="font-medium text-primary-700 hover:underline"
          >
            {office.name}
          </Link>
          {office.isPrimary && <PrimaryBadge />}
          {office.status === "closed" && <OfficeClosedBadge />}
        </div>
      </TableCell>
      <TableCell className={`${officeTableCellClass} text-gray-600`}>
        {office.subsidiaryName}
      </TableCell>
      <TableCell className={`${officeTableCellClass} text-gray-600`}>
        {office.region}
      </TableCell>
      <TableCell className={`${officeTableCellClass} text-gray-600`}>
        {office.type}
      </TableCell>
      <TableCell
        className={`${officeTableCellClass} ${subsidiaryStickyActionCellClass}`}
      >
        <OfficeRowActions office={office} />
      </TableCell>
    </TableRow>
  );
}
