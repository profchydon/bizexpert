"use client";

import { DownloadCloud01, Monitor01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import Apple from "@/components/foundations/social-icons/apple";

const STEPS = [
  {
    title: "Download the installer",
    body: "Pick the build for this device's operating system below.",
  },
  {
    title: "Run it with admin rights",
    body: "The agent installs as a background service. No restart needed.",
  },
  {
    title: "Wait for the first sync",
    body: "Health readings appear here about 10 minutes after install.",
  },
];

// Numbered install steps + OS download buttons. Shared by the admin setup state and the
// employee asset view; the MDM deployment card is admin-only and lives outside this
// component on purpose (the employee view must never show it).
export function AgentInstallSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-fg-brand-primary">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className="my-1 w-px flex-1 bg-border-secondary" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 pb-5">
              <p className="text-sm font-semibold text-primary">{step.title}</p>
              <p className="text-sm text-tertiary">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div
        className={
          compact ? "flex flex-col gap-3" : "flex flex-col gap-3 sm:flex-row"
        }
      >
        <Button
          size="md"
          color="secondary"
          iconLeading={Monitor01}
          href="#"
          className={compact ? "w-full" : "flex-1"}
          data-testid="agentinstallsteps-button"
        >
          Download for Windows
        </Button>
        <Button
          size="md"
          color="secondary"
          iconLeading={Apple}
          href="#"
          className={compact ? "w-full" : "flex-1"}
          data-testid="agentinstallsteps-button-2"
        >
          Download for macOS
        </Button>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-tertiary">
        <DownloadCloud01 className="size-3.5" />
        Version 2.4.1. About 18 MB. Runs on Windows 10 and later, macOS 13 and
        later.
      </p>
    </div>
  );
}
