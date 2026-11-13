"use client";

import { Check, Copy01, Monitor01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import Apple from "@/components/foundations/social-icons/apple";
import { useClipboard } from "@/hooks/use-clipboard";
import { DetailCard } from "../DetailCard";

const PACKAGE_ID = "co.rayda.agent.pkg";

const STEPS = [
  {
    title: "Download the installer",
    body: "Take the build for each operating system you deploy to.",
  },
  {
    title: "Upload it to your MDM tool",
    body: "Add it as a custom app or package in Jamf, Intune, Kandji or whatever you use.",
  },
  {
    title: "Assign it to a device group",
    body: "Your MDM installs it on every device in that group. Nobody has to touch a machine.",
  },
];

// The other path that needs nothing from the employee. Admin only, and never shown for a
// personal device.
//
// Rayda does not talk to the MDM. The admin downloads the installer and uploads it to their
// own tool, so the card walks that path rather than implying an integration exists. The
// earlier version handed over a package id and said "point your MDM at this", which
// described a connection that has never been built.
export function MdmDeploymentCard() {
  const { copied, copy } = useClipboard();

  return (
    <DetailCard
      title="Push it silently with MDM"
      collapsible
      defaultOpen={false}
      action={
        <span className="text-sm text-tertiary">Jamf, Intune, Kandji</span>
      }
    >
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
                <p className="text-sm font-semibold text-primary">
                  {step.title}
                </p>
                <p className="text-sm text-tertiary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="md"
            color="secondary"
            iconLeading={Monitor01}
            href="#"
            className="flex-1"
            data-testid="mdmdeploymentcard-button"
          >
            Download for Windows
          </Button>
          <Button
            size="md"
            color="secondary"
            iconLeading={Apple}
            href="#"
            className="flex-1"
            data-testid="mdmdeploymentcard-button-2"
          >
            Download for macOS
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-tertiary">
            Most tools ask for an app identifier so they can tell whether the
            install worked. This is it.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-secondary bg-secondary px-3 py-2">
            <code className="truncate font-mono text-sm text-secondary">
              {PACKAGE_ID}
            </code>
            <Button
              size="sm"
              color="link-gray"
              iconLeading={copied ? Check : Copy01}
              onClick={() => copy(PACKAGE_ID)}
              data-testid="mdmdeploymentcard-button-3"
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </div>
    </DetailCard>
  );
}
