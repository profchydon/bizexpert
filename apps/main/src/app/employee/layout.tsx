import type { Metadata } from "next";
import EmployeeAuthProtectWrapper from "@/components/HOC/EmployeeAuthProtectWrapper";
import EmployeeShell from "./EmployeeShell";

export const metadata: Metadata = {
  title: "Rayda | Dashboard",
  description: "Rayda Remote |  Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EmployeeAuthProtectWrapper>
      <EmployeeShell>{children}</EmployeeShell>
    </EmployeeAuthProtectWrapper>
  );
}
