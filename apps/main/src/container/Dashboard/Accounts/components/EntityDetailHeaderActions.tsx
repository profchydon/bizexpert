"use client";

import { CreditCard, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { accountsDetailActionButtonClass } from "./accountsDetailHeaderClasses";
import { preflightDetailCloseButtonClass } from "./preflightModalClasses";
import type { EntityDetailHeaderAction } from "../utils/entityDetailHeaderActions";

interface Props {
  actions: EntityDetailHeaderAction[];
  isReplacingCard: boolean;
  onEdit: () => void;
  onClose: () => void;
  onReplaceCard: () => void;
  onManageAdmins: () => void;
}

export function EntityDetailHeaderActions({
  actions,
  isReplacingCard,
  onEdit,
  onClose,
  onReplaceCard,
  onManageAdmins,
}: Props) {
  if (!actions.length) return null;

  return (
    <div className="flex items-center gap-3">
      {actions.includes("replace-card") || actions.includes("add-card") ? (
        <Button
          variant="outline"
          size="md"
          className={accountsDetailActionButtonClass}
          onClick={onReplaceCard}
          isLoading={isReplacingCard}
          data-testid="entitydetailheaderactions-button"
        >
          <CreditCard className="size-5 text-gray-400" />
          {actions.includes("replace-card") ? "Replace card" : "Add card"}
        </Button>
      ) : null}
      {actions.includes("edit") && (
        <Button
          variant="outline"
          size="md"
          className={accountsDetailActionButtonClass}
          onClick={onEdit}
          disabled={isReplacingCard}
          data-testid="entitydetailheaderactions-button-2"
        >
          <Pencil className="size-5 text-gray-400" />
          Edit
        </Button>
      )}
      {actions.includes("manage-admins") && (
        <Button
          variant="outline"
          size="md"
          className={accountsDetailActionButtonClass}
          onClick={onManageAdmins}
          disabled={isReplacingCard}
          data-testid="entitydetailheaderactions-button-3"
        >
          <Users className="size-5 text-gray-400" />
          Manage admins
        </Button>
      )}
      {actions.includes("close") && (
        <Button
          variant="outline"
          size="md"
          className={preflightDetailCloseButtonClass}
          onClick={onClose}
          disabled={isReplacingCard}
          data-testid="entitydetailheaderactions-button-4"
        >
          <Trash2 className="size-5 text-error-500" />
          Close entity
        </Button>
      )}
    </div>
  );
}
