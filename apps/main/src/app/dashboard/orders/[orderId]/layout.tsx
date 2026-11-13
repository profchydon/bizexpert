import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Department",
  description: "Rayda Remote |  Dashboard | Department",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
