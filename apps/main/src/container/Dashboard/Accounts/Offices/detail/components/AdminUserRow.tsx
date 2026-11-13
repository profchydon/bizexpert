import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/utils/getInitials";
import type { OfficeAdminRef } from "../../../types";

function initialsOf(value: string): string {
  return getInitials(value)?.slice(0, 2) || value.slice(0, 2).toUpperCase();
}

interface Props {
  admin: OfficeAdminRef;
  canRevoke: boolean;
  onRevoke: () => void;
}

export function AdminUserRow({ admin, canRevoke, onRevoke }: Props) {
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
        {initialsOf(admin.name)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-gray-900">
          {admin.name}
        </span>
        {admin.id ? null : (
          <Badge color="warning" size="sm">
            Pending invitation
          </Badge>
        )}
      </div>
      {canRevoke ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-error-600 hover:bg-error-50 hover:text-error-700"
          onClick={onRevoke}
          data-testid="adminuserrow-button"
        >
          Revoke access
        </Button>
      ) : (
        <span className="shrink-0 text-xs font-medium text-gray-400">
          Only admin
        </span>
      )}
    </li>
  );
}
