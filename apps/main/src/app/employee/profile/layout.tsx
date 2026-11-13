import type { Metadata } from "next";
import AuthProtectWrapper from "@/components/HOC/AuthProtectWrapper";

export const metadata: Metadata = {
  title: "Rayda | Employee | Profile",
  description: "Rayda Remote | Employee |  Profile",
};

export default function EmployeeProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
