import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda Remote | Login",
  description: "Rayda Remote | Login",
};

export default function AuthCallBackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
