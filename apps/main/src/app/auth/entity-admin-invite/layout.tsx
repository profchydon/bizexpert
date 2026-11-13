import EntityAdminInviteSessionWrapper from "@/components/HOC/EntityAdminInviteSessionWrapper";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Rayda Remote | Entity Admin Invite",
  description: "Rayda Remote | Entity Admin Invite",
};

export default function EntityAdminInviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={children}>
      <EntityAdminInviteSessionWrapper>
        {children}
      </EntityAdminInviteSessionWrapper>
    </Suspense>
  );
}
