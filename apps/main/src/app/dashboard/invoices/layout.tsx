import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Invoices",
  description: "Rayda Remote | Dashboard | Invoices",
};

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
