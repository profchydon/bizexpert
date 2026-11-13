import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Dashboard | Transactions",
  description: "Rayda Remote |  Dashboard | Transactions",
};

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
