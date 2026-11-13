"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { EntityAdminRow as AdminRow } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityPersonLabel";
import { entityAdminInitials } from "../utils/entityDetailHeaderActions";

interface Props {
  admin: AdminRow;
  pending?: boolean;
  canRevoke: boolean;
  disabled: boolean;
  onRevoke: () => void;
}

export function EntityAdminRow({
  admin,
  pending = false,
  canRevoke,
  disabled,
  onRevoke,
}: Props) {
  const email = admin.email && admin.email !== admin.name ? admin.email : "";

  return (
    <li className="flex items-center gap-3 py-3">
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="bg-gray-100 text-sm font-medium text-gray-600">
          {entityAdminInitials(admin.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-gray-900">
          {admin.name}
        </span>
        {pending && (
          <span className="w-fit rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700">
            Pending invitation
          </span>
        )}
        {!pending && email ? (
          <span className="truncate text-sm text-gray-600">{email}</span>
        ) : null}
      </div>
      {canRevoke ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 text-sm font-semibold text-error-600 hover:bg-error-50 hover:text-error-700"
          onClick={onRevoke}
          disabled={disabled}
          data-testid="entityadminrow-button"
        >
          {pending ? "Cancel invite" : "Revoke access"}
        </Button>
      ) : (
        <span className="shrink-0 text-xs font-medium text-gray-400">
          Only admin
        </span>
      )}
    </li>
  );
}
