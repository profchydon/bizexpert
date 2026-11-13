import AuthRedirectWrapper from "@/components/HOC/AuthRedirectWrapper";
import { BizExpertAuthProvider } from "@/store/bizexpert/auth-context";
import { isBizExpertApp } from "@/config/product";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: isBizExpertApp() ? "BizExpert | Login" : "Rayda Remote | Login",
  description: isBizExpertApp() ? "BizExpert | Login" : "Rayda Remote | Login",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (isBizExpertApp()) {
    return <BizExpertAuthProvider>{children}</BizExpertAuthProvider>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <AuthRedirectWrapper>{children}</AuthRedirectWrapper>
    </Suspense>
  );
}
