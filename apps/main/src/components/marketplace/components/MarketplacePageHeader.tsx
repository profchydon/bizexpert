import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export interface MarketplacePageHeaderProps {
  breadcrumbs?: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  actionsSlot?: ReactNode;
  className?: string;
}

export const MarketplacePageHeader = ({
  breadcrumbs,
  pageTitle = "Marketplace",
  pageDescription = "Select items for this catalogs",
  actionsSlot,
  className,
}: MarketplacePageHeaderProps) => (
  <div className={cn("mp-root mp-w-full", className)}>
    <div className="mp-flex mp-flex-col mp-gap-5">
      <div className="mp-flex mp-flex-col mp-gap-4 sm:mp-flex-row sm:mp-items-start sm:mp-justify-between">
        <div className="mp-flex mp-flex-col mp-gap-1">
          <h1 className="mp-text-2xl mp-leading-[32px] mp-font-semibold mp-text-gray-900">
            {pageTitle}
          </h1>
          <p className="mp-text-base mp-leading-6 mp-text-gray-500">
            {pageDescription}
          </p>
        </div>
        {actionsSlot ? <div>{actionsSlot}</div> : null}
      </div>

      <div className="mp-h-px mp-w-full mp-bg-gray-200" />
    </div>

    {breadcrumbs ? (
      <nav
        aria-label="Breadcrumb"
        className="mp-mt-4 mp-flex mp-flex-wrap mp-items-center mp-gap-2 sm:mp-gap-3 mp-text-sm mp-text-gray-500"
      >
        {breadcrumbs}
      </nav>
    ) : null}
  </div>
);
