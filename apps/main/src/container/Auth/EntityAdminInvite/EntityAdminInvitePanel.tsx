"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAcceptEntityAdminInvitationMutation } from "@/api/baseQueries/companiesApi/entitiesApi/acceptEntityAdminInvitation";
import type { EntityAdminInvitation } from "@/api/baseQueries/companiesApi/entitiesApi/entityAdminInvitationTypes";
import routes from "@/routes";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { EntityAdminInviteAcceptIntro } from "./EntityAdminInviteAcceptIntro";
import {
  entityAdminInviteAlternateLoginLabel,
  entityAdminInviteExpiryChipLabel,
  entityAdminInviteIsExpired,
  entityAdminInviteStatusMessage,
} from "./entityAdminInviteCopy";
import { entityAdminInviteHasExistingAccount } from "./entityAdminInviteRouting";
import { EntityAdminInviteSummaryCard } from "./EntityAdminInviteSummaryCard";
import { trackEntityAdminInvite } from "@/lib/entityAdminInviteAnalytics";

interface Props {
  invitation: EntityAdminInvitation;
}

export function EntityAdminInvitePanel({ invitation }: Props) {
  const router = useRouter();
  const [acceptInvitation, acceptInvitationState] =
    useAcceptEntityAdminInvitationMutation();

  const statusMessage = entityAdminInviteStatusMessage(invitation.status);
  const expired =
    entityAdminInviteIsExpired(invitation.expires_at) || statusMessage !== null;
  const expiryChipLabel = entityAdminInviteExpiryChipLabel(
    invitation.expires_at,
  );
  const hasExistingAccount = entityAdminInviteHasExistingAccount(invitation);

  useEffect(() => {
    trackEntityAdminInvite({
      action: "viewed",
      invitation_id: invitation.id,
      entity_id: invitation.entity.id,
    });
  }, [invitation.id, invitation.entity.id]);

  async function handleAccept() {
    try {
      const response = await acceptInvitation({
        code: invitation.code,
      }).unwrap();
      displaySuccessMessage(
        response.message || "Invitation accepted. You can now log in.",
      );
      trackEntityAdminInvite({
        action: "completed",
        invitation_id: invitation.id,
        entity_id: invitation.entity.id,
      });
      router.push(`${routes.LOGIN}?switch_account=1`);
    } catch (error) {
      const status = (error as { status?: number })?.status;
      if (status === 410) {
        displayErrorMessage("This invitation has expired.");
        return;
      }
      if (status === 404) {
        displayErrorMessage("Invitation not found.");
        return;
      }
      displayErrorMessage("Unable to accept this invitation. Try again later.");
    }
  }

  return (
    <div className="grid h-screen place-content-center py-4 sm:py-8 2xl:py-0">
      <div className="w-full lg:min-w-[27rem]">
        <EntityAdminInviteAcceptIntro
          invitation={invitation}
          hasExistingAccount={hasExistingAccount}
        />

        <EntityAdminInviteSummaryCard
          email={invitation.email}
          entityName={invitation.entity.name}
          accountCompanyName={invitation.account_company.name}
        />

        {statusMessage ? (
          <p className="mt-4 text-sm text-error-600">{statusMessage}</p>
        ) : null}

        <div className="mt-6 flex flex-col items-stretch gap-3">
          {expiryChipLabel ? (
            <span className="self-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
              {expiryChipLabel}
            </span>
          ) : null}
          <Button
            variant="primary"
            className="w-full"
            disabled={
              expired ||
              acceptInvitationState.isLoading ||
              invitation.status !== "pending"
            }
            isLoading={acceptInvitationState.isLoading}
            onClick={handleAccept}
            data-testid="entityadmininvitepanel-button"
          >
            Accept invite
          </Button>
        </div>

        <Link href={routes.LOGIN}>
          <div className="mt-8 text-center">
            <span className="text-sm text-gray-600">
              {entityAdminInviteAlternateLoginLabel()}
            </span>{" "}
            <span className="text-sm font-medium text-primary-700">Log in</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
