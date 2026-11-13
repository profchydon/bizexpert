"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AccountsFloatingAlert } from "./components/AccountsFloatingAlert";
import { AccountsPageHeader } from "./components/AccountsPageHeader";
import { AccountsPageTabs } from "./components/AccountsPageTabs";
import { CreateSubsidiaryWizard } from "./components/CreateSubsidiaryWizard";
import { SubsidiaryPlanModal } from "./components/SubsidiaryPlanModal";
import { useAccountsPlan, useActingAdmin } from "./hooks/useAccountsData";
import { useEntityCardSetupReturn } from "./hooks/useEntityCardSetupReturn";
import { canCreateEntities } from "./utils/adminScope";
import { useDashboardPermissions } from "@/hooks/useDashboardPermissions";

export default function AccountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tier: planTier, ready: planReady } = useAccountsPlan();
  const acting = useActingAdmin();
  const permissions = useDashboardPermissions();
  const [tab, setTab] = useState(
    searchParams.get("tab") === "offices" ? "offices" : "subsidiaries",
  );
  const [createOpen, setCreateOpen] = useState(false);
  const { returnDone, clearReturnDone, isResumingCardCapture } =
    useEntityCardSetupReturn();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [alert, setAlert] = useState<{
    title: string;
    description?: string;
    color: "success" | "warning";
  } | null>(null);

  const canCreateReal = planTier === "scale" && canCreateEntities(acting);
  const wizardOpen = createOpen || !!returnDone || isResumingCardCapture;

  useEffect(() => {
    if (searchParams.get("tab") === "offices") {
      setTab("offices");
    }
  }, [searchParams]);

  useEffect(() => {
    if (permissions.canViewAccountsIndex) return;
    if (!permissions.entityDetailPath) return;
    router.replace(permissions.entityDetailPath);
  }, [permissions.canViewAccountsIndex, permissions.entityDetailPath, router]);

  if (!permissions.canViewAccountsIndex) {
    return null;
  }

  function handleTabChange(value: string) {
    setTab(value);
    const params = new URLSearchParams(window.location.search);
    if (value === "offices") params.set("tab", "offices");
    else params.delete("tab");
    const query = params.toString();
    const url = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState(null, "", url);
  }

  function handleCreateIntent() {
    if (!planReady) return;
    if (canCreateReal) {
      clearReturnDone();
      setCreateOpen(true);
      return;
    }
    setPlanModalOpen(true);
  }

  function handleWizardClose() {
    setCreateOpen(false);
    clearReturnDone();
  }

  function handleCreated(summary: { name: string; stalled: boolean }) {
    setAlert({
      title: summary.stalled
        ? `${summary.name} created — card pending`
        : `${summary.name} is operational`,
      description: summary.stalled
        ? "Complete card capture from the entity page to enable billing."
        : "The entity is live and bills independently.",
      color: summary.stalled ? "warning" : "success",
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col pb-10 pt-6 lg:pt-8">
      <AccountsPageHeader />
      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        <AccountsPageTabs
          tab={tab}
          onTabChange={handleTabChange}
          onCreate={handleCreateIntent}
        />
      </div>
      <CreateSubsidiaryWizard
        isOpen={wizardOpen}
        onClose={handleWizardClose}
        onCreated={handleCreated}
        returnDone={returnDone}
        isResumingCardCapture={isResumingCardCapture}
      />
      <SubsidiaryPlanModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
      />
      <AccountsFloatingAlert
        show={!!alert}
        color={alert?.color ?? "success"}
        title={alert?.title ?? ""}
        description={alert?.description}
        onDismiss={() => setAlert(null)}
      />
    </div>
  );
}
