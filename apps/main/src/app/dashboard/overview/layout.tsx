import { isBizExpertApp } from "@/config/product";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: isBizExpertApp()
    ? "BizExpert | Overview"
    : "Rayda | Dashboard | Overview",
  description: isBizExpertApp()
    ? "BizExpert | Overview"
    : "Rayda Remote |  Dashboard | Overview",
};

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
