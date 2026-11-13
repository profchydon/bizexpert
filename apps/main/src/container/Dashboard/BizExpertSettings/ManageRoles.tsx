"use client";

import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { ManageRolesTable } from "./ManageRolesTable";

export function ManageRoles() {
  const { businessId } = useBizExpertBusiness();

  if (!businessId) {
    return (
      <p className="py-8 text-secondary">
        No business selected.{" "}
        <a href="/onboarding/business" className="text-brand-600 underline">
          Create one
        </a>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Manage roles</h2>
        <p className="mt-1 text-sm text-gray-600">
          Default access levels for this business. Custom roles cannot be
          created.
        </p>
      </div>
      <ManageRolesTable businessId={businessId} />
    </div>
  );
}
