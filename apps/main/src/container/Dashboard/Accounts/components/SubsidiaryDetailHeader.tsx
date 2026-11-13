"use client";

import { PrimaryBadge } from "./PrimaryBadge";
import { AccountsDetailBreadcrumb } from "./AccountsDetailBreadcrumb";
import { EntityDetailHeaderActions } from "./EntityDetailHeaderActions";
import {
  accountsDetailHeaderDividerClass,
  accountsDetailHeaderShellClass,
  accountsDetailHeaderTitleBlockClass,
} from "./accountsDetailHeaderClasses";
import { subsidiaryDetailTitleClass } from "./detailCardClasses";
import type { Subsidiary } from "../types";
import { entityDetailHeaderActions } from "../utils/entityDetailHeaderActions";
import { isPrimaryEntity } from "../utils/isPrimaryEntity";

interface Props {
  subsidiary: Subsidiary;
  companyId?: string | null;
  canEdit: boolean;
  canClose: boolean;
  isReplacingCard?: boolean;
  onEdit: () => void;
  onClose: () => void;
  onReplaceCard: () => void;
  onManageAdmins: () => void;
}

export function SubsidiaryDetailHeader({
  subsidiary,
  companyId,
  canEdit,
  canClose,
  isReplacingCard = false,
  onEdit,
  onClose,
  onReplaceCard,
  onManageAdmins,
}: Props) {
  const primaryEntity = isPrimaryEntity(subsidiary, companyId);
  const actions = entityDetailHeaderActions({
    isPrimary: primaryEntity,
    canEdit,
    canClose,
    cardOnFile: subsidiary.cardOnFile,
  });

  return (
    <div className={accountsDetailHeaderShellClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className={accountsDetailHeaderTitleBlockClass}>
          <div className="flex items-center gap-3">
            <h1 className={subsidiaryDetailTitleClass}>{subsidiary.name}</h1>
            {primaryEntity && <PrimaryBadge size="md" />}
          </div>
          <p className="text-sm text-gray-600">
            {subsidiary.region} · Independent billing entity
          </p>
        </div>
        <EntityDetailHeaderActions
          actions={actions}
          isReplacingCard={isReplacingCard}
          onEdit={onEdit}
          onClose={onClose}
          onReplaceCard={onReplaceCard}
          onManageAdmins={onManageAdmins}
        />
      </div>
      <div className={accountsDetailHeaderDividerClass} />
      <AccountsDetailBreadcrumb currentLabel={subsidiary.name} />
    </div>
  );
}
