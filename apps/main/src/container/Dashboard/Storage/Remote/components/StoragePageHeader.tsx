import { ChevronRight, Download01, HomeLine, Plus } from "@untitledui/icons";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { storageAppRoutes } from "../storageAppRoutes";

interface Props {
  onExport: () => void;
  exportLoading?: boolean;
  importDisabledReason: string;
}

export function StoragePageHeader({
  onExport,
  exportLoading,
  importDisabledReason,
}: Props) {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Storage</h1>
          <p className="mt-1 text-sm text-tertiary">
            All devices held in Rayda storage across your countries.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <DisabledWithTooltip
            isDisabled
            reason={importDisabledReason}
            triggerClassName="w-full sm:w-auto"
          >
            <Button
              size="md"
              iconLeading={Plus}
              isDisabled
              className="w-full sm:w-auto"
              data-testid="storagepageheader-button"
            >
              Import devices
            </Button>
          </DisabledWithTooltip>
          <Button
            size="md"
            color="secondary"
            iconLeading={Download01}
            isLoading={exportLoading}
            onClick={onExport}
            className="w-full sm:w-auto"
            data-testid="storagepageheader-button-2"
          >
            Export
          </Button>
        </div>
      </div>
      <nav className="mt-6 flex items-center gap-3">
        <Link
          href={storageAppRoutes.dashboard}
          aria-label="Dashboard"
          className="text-quaternary transition hover:text-secondary"
        >
          <HomeLine className="size-5" />
        </Link>
        <ChevronRight className="size-4 text-quaternary" />
        <span className="text-sm font-semibold text-brand-600">Storage</span>
      </nav>
    </>
  );
}
