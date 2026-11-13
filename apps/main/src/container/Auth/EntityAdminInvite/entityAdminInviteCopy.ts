import { differenceInCalendarDays, parseISO } from "date-fns";

export function entityAdminInviteEyebrow() {
  return "Admin invite";
}

export function entityAdminInviteTitle() {
  return "Accept your invite";
}

export function entityAdminInviteIntro(
  accountCompanyName: string,
  entityName: string,
) {
  return `${accountCompanyName} has invited you to administer ${entityName} on Rayda Remote.`;
}

export function entityAdminInviteIntroFromInviter(
  inviterName: string,
  entityName: string,
) {
  return `${inviterName} has invited you to administer ${entityName} on Rayda Remote.`;
}

export function entityAdminInviteIntroLine(
  inviterName: string | null | undefined,
  accountCompanyName: string,
  entityName: string,
) {
  const trimmedInviter = inviterName?.trim();
  if (trimmedInviter) {
    return entityAdminInviteIntroFromInviter(trimmedInviter, entityName);
  }
  return entityAdminInviteIntro(accountCompanyName, entityName);
}

export function entityAdminInviteExistingAccountMessage() {
  return "You already have an account. Accept below to get access.";
}

export function entityAdminInviteSetupAccountMessage() {
  return "Create your account below, then accept the invite.";
}

export function entityAdminInviteRoleLabel() {
  return "Entity administrator";
}

export function entityAdminInviteAlternateLoginLabel() {
  return "Use a different account";
}

export function entityAdminEmployeeSignupStepLabel() {
  return "Step 1 of 2";
}

export function entityAdminEmployeeSignupTitle() {
  return "Create your account";
}

export function entityAdminEmployeeSignupSuccessMessage() {
  return "Account created successfully. Log in to continue.";
}

export function entityAdminInviteExpiryLabel(expiresAt: string) {
  const expires = parseISO(expiresAt);
  if (Number.isNaN(expires.getTime())) return null;

  const days = differenceInCalendarDays(expires, new Date());
  if (days < 0) return "This invitation has expired.";
  if (days === 0) return "This invitation link expires today.";
  if (days === 1) return "This invitation link expires in 1 day.";
  return `This invitation link expires in ${days} days.`;
}

export function entityAdminInviteExpiryChipLabel(expiresAt: string) {
  const expires = parseISO(expiresAt);
  if (Number.isNaN(expires.getTime())) return null;

  const days = differenceInCalendarDays(expires, new Date());
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires in 1 day";
  return `Expires in ${days} days`;
}

export function entityAdminInviteIsExpired(expiresAt: string) {
  const expires = parseISO(expiresAt);
  if (Number.isNaN(expires.getTime())) return false;
  return expires.getTime() < Date.now();
}

export function entityAdminInviteStatusMessage(status: string) {
  if (status === "pending") return null;
  if (status === "accepted") {
    return "This invitation has already been accepted.";
  }
  return "This invitation is no longer available.";
}

export function entityAdminInviteErrorMessage(status?: number) {
  if (status === 404) return "Invitation not found.";
  if (status === 410) return "This invitation has expired.";
  return "Unable to load this invitation. Try again later.";
}
