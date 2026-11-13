"use client";

import type { ReactNode } from "react";
import PageHeader from "@/components/PageHeader";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { SettingsSectionNav } from "./SettingsSectionNav";
import { settingsPath, type SettingsType } from "./settingsNav";
import { settingsPageSectionClass } from "./settingsPageClasses";

type Props = {
  type: SettingsType;
  breadCrumbs: string[];
  children: ReactNode;
};

export function SettingsShell({ type, breadCrumbs, children }: Props) {
  const { push } = useTransitionRouter();

  return (
    <section className={settingsPageSectionClass}>
      <PageHeader
        pageTitle="Settings"
        pageDescription="Manage your account preferences, roles, and integrations."
        breadCrumbs={breadCrumbs}
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <SettingsSectionNav
          type={type}
          onChange={(next) => push(settingsPath(next))}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  );
}
