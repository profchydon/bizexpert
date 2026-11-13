import AuthRedirectWrapper from "@/components/HOC/AuthRedirectWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rayda | Onboarding",
  description: "Rayda Remote",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
