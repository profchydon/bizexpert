import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Offboarding | Order Summary",
  description: "Rayda Remote |  Dashboard | Offboarding | Order Summary",
};

export default function OffboardingOrderSummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
