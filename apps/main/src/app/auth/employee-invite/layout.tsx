import AuthRedirectWrapper from "@/components/HOC/AuthRedirectWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda Remote | Employee Invite",
  description: "Rayda Remote | Employee Invite",
};

export default function EmployeeInviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
