"use client";

import { Pencil, ShoppingCart, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuyForOffice } from "../hooks/useBuyForOffice";
import routes from "@/routes";
import { PrimaryBadge } from "../../components/PrimaryBadge";
import { AccountsDetailBreadcrumb } from "../../components/AccountsDetailBreadcrumb";
import {
  accountsDetailActionButtonClass,
  accountsDetailHeaderDividerClass,
  accountsDetailHeaderShellClass,
  accountsDetailHeaderTitleBlockClass,
  accountsDetailPrimaryButtonClass,
} from "../../components/accountsDetailHeaderClasses";
import { preflightDetailCloseButtonClass } from "../../components/preflightModalClasses";
import { subsidiaryDetailTitleClass } from "../../components/detailCardClasses";
import type { Office } from "../../types";

interface Props {
  office: Office;
  canEdit: boolean;
  canClose: boolean;
  onEdit: () => void;
  onClose: () => void;
  onManageAdmins: () => void;
}

export function OfficeDetailHeader({
  office,
  canEdit,
  canClose,
  onEdit,
  onClose,
  onManageAdmins,
}: Props) {
  const { canBuy, buyForOffice } = useBuyForOffice(office, canEdit);
  return (
    <div className={accountsDetailHeaderShellClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className={accountsDetailHeaderTitleBlockClass}>
          <div className="flex items-center gap-3">
            <h1 className={subsidiaryDetailTitleClass}>{office.name}</h1>
            {office.isPrimary && <PrimaryBadge size="md" />}
          </div>
          <p className="text-sm text-gray-600">
            {office.subsidiaryName} · {office.region} · {office.type} office
          </p>
        </div>
        {(canBuy || canEdit || canClose) && (
          <div className="flex items-center gap-3">
            {canBuy && (
              <Button
                size="md"
                variant="primary"
                className={accountsDetailPrimaryButtonClass}
                onClick={buyForOffice}
                data-testid="officedetailheader-button"
              >
                <ShoppingCart className="size-5" />
                Buy for this office
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="md"
                className={accountsDetailActionButtonClass}
                onClick={onEdit}
                data-testid="officedetailheader-button-2"
              >
                <Pencil className="size-5 text-gray-400" />
                Edit
              </Button>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="md"
                className={accountsDetailActionButtonClass}
                onClick={onManageAdmins}
                data-testid="officedetailheader-button-3"
              >
                <Users className="size-5 text-gray-400" />
                Manage admins
              </Button>
            )}
            {canClose && (
              <Button
                variant="outline"
                size="md"
                className={preflightDetailCloseButtonClass}
                onClick={onClose}
                data-testid="officedetailheader-button-4"
              >
                <Trash2 className="size-5 text-error-500" />
                Close office
              </Button>
            )}
          </div>
        )}
      </div>
      <div className={accountsDetailHeaderDividerClass} />
      <AccountsDetailBreadcrumb
        currentLabel={office.name}
        parent={{
          href: routes.SUBSIDIARY_DETAIL(office.subsidiaryId),
          label: office.subsidiaryName,
        }}
      />
    </div>
  );
}
