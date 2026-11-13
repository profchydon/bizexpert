import type { Metadata } from "next";
import KitAccessWrapper from "@/container/Dashboard/Kits/KitAccessWrapper";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Kits",
  description: "Rayda Remote | Dashboard | Kits",
};

export default function KitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KitAccessWrapper>{children}</KitAccessWrapper>;
}
