import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { MarketplacePageHeader } from "./MarketplacePageHeader";

export interface MarketplaceProductDetailPageLayoutProps {
  pageTitle: string;
  pageDescription?: string;
  breadcrumbs?: ReactNode;
  actionsSlot?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const MarketplaceProductDetailPageLayout = ({
  pageTitle,
  pageDescription,
  breadcrumbs,
  actionsSlot,
  children,
  className,
  headerClassName,
  contentClassName,
}: MarketplaceProductDetailPageLayoutProps) => (
  <div className={cn("mp-root mp-flex mp-min-h-screen mp-flex-col", className)}>
    <main className="mp-flex mp-flex-1 mp-flex-col mp-gap-6 sm:mp-gap-8 mp-pb-12 mp-pt-8 sm:mp-pb-24 sm:mp-pt-12">
      <div className={headerClassName}>
        <MarketplacePageHeader
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          breadcrumbs={breadcrumbs}
          actionsSlot={actionsSlot}
        />
      </div>
      <div className={contentClassName}>{children}</div>
    </main>
  </div>
);
