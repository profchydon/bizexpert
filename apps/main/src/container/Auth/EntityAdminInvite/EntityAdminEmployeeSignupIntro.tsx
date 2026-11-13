import Image from "next/image";
import { logo_black as logo } from "@/assets/images";
import type { EntityAdminInvitation } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitationTypes";
import {
  entityAdminEmployeeSignupStepLabel,
  entityAdminEmployeeSignupTitle,
  entityAdminInviteExpiryLabel,
} from "./entityAdminInviteCopy";

export function EntityAdminEmployeeSignupIntro({
  invitation,
  inviterName,
}: {
  invitation: EntityAdminInvitation;
  inviterName?: string | null;
}) {
  const expiryLabel = entityAdminInviteExpiryLabel(invitation.expires_at);
  const trimmedInviter = inviterName?.trim();
  const entityName = invitation.entity.name;
  const accountCompanyName = invitation.account_company.name;

  return (
    <div className="mb-6 flex flex-col gap-y-3">
      <Image src={logo} alt="Rayda logo" />
      <p className="text-sm font-medium text-primary-700">
        {entityAdminEmployeeSignupStepLabel()}
      </p>
      <h1 className="text-2xl font-semibold text-gray-900 lg:text-3xl">
        {entityAdminEmployeeSignupTitle()}
      </h1>
      <p className="max-w-md text-base text-gray-600">
        {trimmedInviter ? (
          <>
            {trimmedInviter} has invited you to administer{" "}
            <span className="font-semibold text-gray-900">{entityName}</span> on
            Rayda Remote.
          </>
        ) : (
          <>
            {accountCompanyName} has invited you to administer{" "}
            <span className="font-semibold text-gray-900">{entityName}</span> on
            Rayda Remote.
          </>
        )}
      </p>
      {expiryLabel ? (
        <p className="text-sm text-gray-500">{expiryLabel}</p>
      ) : null}
    </div>
  );
}
