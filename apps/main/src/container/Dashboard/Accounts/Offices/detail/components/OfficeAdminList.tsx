"use client";

import Link from "next/link";
import routes from "@/routes";
import { cn } from "@/lib/utils";
import type { OfficeAdminRef } from "../../../types";

const adminChipClass =
  "rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700";

const adminLinkClass =
  "hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700";

export function OfficeAdminList({ admins }: { admins: OfficeAdminRef[] }) {
  if (!admins.length) {
    return <span className="text-gray-500">Not assigned</span>;
  }

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {admins.map((admin, index) =>
        admin.id ? (
          <Link
            key={admin.id}
            href={`${routes.EMPLOYEES}/${admin.id}`}
            className={cn(adminChipClass, adminLinkClass)}
          >
            {admin.name}
          </Link>
        ) : (
          <span key={`${admin.name}-${index}`} className={adminChipClass}>
            {admin.name}
          </span>
        ),
      )}
    </div>
  );
}
