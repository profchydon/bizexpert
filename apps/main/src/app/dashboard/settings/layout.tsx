import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Settings",
  description: "Rayda Remote |  Dashboard | Settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
