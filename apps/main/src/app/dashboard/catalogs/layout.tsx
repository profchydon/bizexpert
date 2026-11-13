import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Catalogs",
  description: "Rayda Remote |  Dashboard | Catalogs",
};

export default function Catalogs_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
