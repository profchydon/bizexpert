import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  onBack?: () => void;
  breadCrumbs?: string[] | React.ReactNode[] | undefined;
  pageTitle: string | React.ReactNode;
  pageDescription: string | React.ReactNode;
  extraDescription?: string | React.ReactNode;
  maxBreadCrumbItems?: number;
  showBackButton?: boolean;
}

const PageHeader: React.FC<React.PropsWithChildren<Props>> = ({
  breadCrumbs,
  pageDescription,
  pageTitle,
  children,
  extraDescription,
}) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-600">{pageDescription}</p>
          {extraDescription && (
            <p className="text-sm text-gray-600">{extraDescription}</p>
          )}
        </div>
        {children && <div>{children}</div>}
      </div>

      <div className="h-px w-full bg-gray-200" />

      {breadCrumbs && (
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2"
        >
          <Link
            href="/dashboard"
            aria-label="Dashboard"
            className="rounded-md p-1 text-gray-600 transition hover:bg-gray-50"
          >
            <Home className="size-5" />
          </Link>
          {breadCrumbs.map((breadcrumb, index) => {
            const isActiveBreadcrumb = index === breadCrumbs.length - 1;
            const isBreadcrumbElement = React.isValidElement<{
              className?: string;
            }>(breadcrumb);

            const breadcrumbClassName = isActiveBreadcrumb
              ? "text-sm font-semibold text-primary-700"
              : "text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors";

            const breadcrumbNode = isBreadcrumbElement
              ? React.cloneElement(breadcrumb, {
                  className: cn(
                    breadcrumbClassName,
                    breadcrumb.props.className,
                  ),
                })
              : breadcrumb;

            return (
              <React.Fragment key={index}>
                <ChevronRight className="size-4 text-gray-500" />
                {isActiveBreadcrumb ? (
                  <span aria-current="page" className={breadcrumbClassName}>
                    {breadcrumbNode}
                  </span>
                ) : isBreadcrumbElement ? (
                  breadcrumbNode
                ) : (
                  <span className={breadcrumbClassName}>{breadcrumbNode}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default PageHeader;
