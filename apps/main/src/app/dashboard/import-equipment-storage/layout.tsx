import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Import-Equipment-Storage",
  description: "Rayda Remote |  Dashboard | Import-Equipment-Storage",
};

export default function StorageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
