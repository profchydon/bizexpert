import Image from "next/image";
import { logo_black as logo } from "@/assets/images";
import type { EntityAdminInvitation } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitationTypes";
import {
  entityAdminInviteExistingAccountMessage,
  entityAdminInviteEyebrow,
  entityAdminInviteSetupAccountMessage,
  entityAdminInviteTitle,
} from "./entityAdminInviteCopy";

interface Props {
  invitation: EntityAdminInvitation;
  hasExistingAccount: boolean;
  inviterName?: string | null;
}

export function EntityAdminInviteAcceptIntro({
  invitation,
  hasExistingAccount,
  inviterName,
}: Props) {
  const entityName = invitation.entity.name;
  const trimmedInviter = inviterName?.trim();

  return (
    <div className="mb-6 flex flex-col gap-y-3">
      <Image src={logo} alt="Rayda logo" />
      <p className="text-sm font-medium text-primary-700">
        {entityAdminInviteEyebrow()}
      </p>
      <h1 className="text-2xl font-semibold leading-tight text-gray-900 lg:text-3xl">
        {entityAdminInviteTitle()}
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
            {invitation.account_company.name} has invited you to administer{" "}
            <span className="font-semibold text-gray-900">{entityName}</span> on
            Rayda Remote.
          </>
        )}
      </p>
      <p className="max-w-md text-sm text-gray-500">
        {hasExistingAccount
          ? entityAdminInviteExistingAccountMessage()
          : entityAdminInviteSetupAccountMessage()}
      </p>
    </div>
  );
}
