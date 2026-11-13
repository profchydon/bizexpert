import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Storage",
  description: "Rayda Remote | Dashboard | Storage",
};

export default function StorageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
