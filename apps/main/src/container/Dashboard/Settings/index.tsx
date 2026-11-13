"use client";

import { useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { useQueryState } from "nuqs";
import Users from "./Users";
import Subscription from "./Subscription";
import CompanyInfo from "./CompanyInfo";
import Support from "./Support";
import Integrations from "./Integrations";
import NotificationSettings from "./NotificationSettings";
import ApiKeys from "./ApiKeys";
import EquipmentRefresh from "./EquipmentRefresh";
import BillingTaxSection from "./BillingTaxSection";
import { SettingsSectionNav } from "./SettingsSectionNav";
import { resolveSettingsType, type SettingsType } from "./settingsNav";

const SECTIONS: Record<SettingsType, ReactNode> = {
  "company-info": <CompanyInfo />,
  "billing-and-tax": <BillingTaxSection />,
  subscription: <Subscription />,
  integrations: <Integrations />,
  users: <Users />,
  support: <Support />,
  credentials: <ApiKeys />,
  "notification-settings": <NotificationSettings />,
  "equipment-refresh": <EquipmentRefresh />,
};

const Settings = () => {
  const param = useSearchParams();
  const settingsType = param.get("settingsType");
  const ref = param.get("tx_ref");
  const [settingTab, setSettingTab] = useQueryState("settingsType");
  const activeType = resolveSettingsType(settingTab);

  useEffect(() => {
    const next = ref ? "subscription" : resolveSettingsType(settingsType);
    setSettingTab(next);
  }, [ref, setSettingTab, settingsType]);

  return (
    <div className="flex flex-col gap-6 py-6 lg:py-8">
      <PageHeader
        breadCrumbs={["Settings"]}
        pageTitle="Settings"
        pageDescription="Manage your team and preferences here."
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <SettingsSectionNav
          type={activeType}
          onChange={(next) => setSettingTab(next)}
        />
        <div className="min-w-0 flex-1">{SECTIONS[activeType]}</div>
      </div>
    </div>
  );
};

export default Settings;
