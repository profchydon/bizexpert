import type { Metadata } from "next";
import { Suspense } from "react";
import NavBar from "./NavBar";
import AuthProtectWrapper from "@/components/HOC/AuthProtectWrapper";
import SubscriptionRouteGuard from "@/components/SubscriptionRouteGuard";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";
import { WorkspaceSwitchLoadingOverlay } from "@/components/workspace/WorkspaceSwitchLoadingOverlay";
import ImpersonationBanner from "@/components/ImpersonationBanner";
import { isBizExpertApp } from "@/config/product";
import { BizExpertAppProviders } from "@/components/bizexpert/BizExpertAppProviders";
import { BizExpertAuthProtectWrapper } from "@/components/bizexpert/BizExpertAuthProtectWrapper";
import { BizExpertDashboardFrame } from "@/components/bizexpert/BizExpertDashboardFrame";

export const metadata: Metadata = {
  title: isBizExpertApp() ? "BizExpert | Dashboard" : "Rayda | Dashboard",
  description: isBizExpertApp()
    ? "BizExpert inventory dashboard"
    : "Rayda Remote |  Dashboard",
};

function BizExpertDashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <BizExpertAppProviders>
      <BizExpertAuthProtectWrapper>
        <BizExpertDashboardFrame>{children}</BizExpertDashboardFrame>
      </BizExpertAuthProtectWrapper>
    </BizExpertAppProviders>
  );
}

function RaydaDashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <WorkspaceSwitchLoadingOverlay />
      </Suspense>
      <AuthProtectWrapper>
        <ImpersonationBanner />
        <Suspense fallback={null}>
          <NavBar />
        </Suspense>
        <AppLayoutWrapper>
          <SubscriptionRouteGuard>{children}</SubscriptionRouteGuard>
        </AppLayoutWrapper>
      </AuthProtectWrapper>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isBizExpertApp()) {
    return <BizExpertDashboardShell>{children}</BizExpertDashboardShell>;
  }
  return <RaydaDashboardShell>{children}</RaydaDashboardShell>;
}
