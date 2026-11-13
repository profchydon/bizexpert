import type { Metadata } from "next";
import AuthProtectWrapper from "@/components/HOC/AuthProtectWrapper";

export const metadata: Metadata = {
  title: "Rayda | Employee | Assets",
  description: "Rayda Remote | Employee |  Assets",
};

export default function EmployeeAssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
