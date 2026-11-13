import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Widget",
  description: "Rayda Remote |  Dashboard | Widget",
};

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
