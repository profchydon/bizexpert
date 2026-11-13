"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ManageRoles } from "./ManageRoles";
import { ProfileSettings } from "./ProfileSettings";
import { resolveSettingsType, type SettingsType } from "./settingsNav";
import { SettingsShell } from "./SettingsShell";
import { WhatsappSettings } from "./WhatsappSettings";

const SECTIONS: Record<SettingsType, React.ReactNode> = {
  profile: <ProfileSettings />,
  roles: <ManageRoles />,
  whatsapp: <WhatsappSettings />,
};

export default function BizExpertSettings() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeType = resolveSettingsType(searchParams.get("tab"), pathname);

  return (
    <SettingsShell
      type={activeType}
      breadCrumbs={
        activeType === "roles" ? ["Settings", "Roles"] : ["Settings"]
      }
    >
      {SECTIONS[activeType]}
    </SettingsShell>
  );
}
