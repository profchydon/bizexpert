import { redirect } from "next/navigation";
import { officeAdminInviteDestinationFromSearch } from "./officeAdminInviteRedirect";

export default async function OfficeAdminInvitePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  redirect(officeAdminInviteDestinationFromSearch(params));
}
