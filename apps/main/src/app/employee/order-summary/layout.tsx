import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Employee | Order Summary",
  description: "Rayda Remote | Employee | Order Summary",
};

export default function EmployeeOrderSummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
