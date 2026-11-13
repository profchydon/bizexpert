import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Offboarding",
  description: "Rayda Remote |  Dashboard | Offboarding",
};

export default function OffboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
