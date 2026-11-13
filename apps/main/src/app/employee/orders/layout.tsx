import type { Metadata } from "next";
import AuthProtectWrapper from "@/components/HOC/AuthProtectWrapper";

export const metadata: Metadata = {
  title: "Rayda | Employee | Orders",
  description: "Rayda Remote | Employee |  Orders",
};

export default function EmployeeOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
