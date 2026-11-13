import { entityAdminInviteRoleLabel } from "./entityAdminInviteCopy";

interface Props {
  email: string;
  entityName: string;
  accountCompanyName: string;
}

export function EntityAdminInviteSummaryCard({
  email,
  entityName,
  accountCompanyName,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Invite details
      </p>
      <dl className="grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-gray-600">Email</dt>
          <dd className="min-w-0 text-right font-medium text-gray-900">
            {email}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-gray-600">Entity</dt>
          <dd className="min-w-0 text-right font-medium text-gray-900">
            {entityName}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-gray-600">Account</dt>
          <dd className="min-w-0 text-right font-medium text-gray-900">
            {accountCompanyName}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-gray-600">Role</dt>
          <dd className="min-w-0 text-right font-medium text-gray-900">
            {entityAdminInviteRoleLabel()}
          </dd>
        </div>
      </dl>
    </div>
  );
}
