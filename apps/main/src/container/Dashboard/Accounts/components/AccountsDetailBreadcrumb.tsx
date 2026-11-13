"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useListReturnHref } from "@/hooks/useTablePageQuery";
import routes from "@/routes";
import {
  accountsBreadcrumbChevronClass,
  accountsBreadcrumbCurrentClass,
  accountsBreadcrumbHomeClass,
  accountsBreadcrumbLinkClass,
  accountsBreadcrumbNavClass,
} from "./accountsDetailHeaderClasses";

interface Props {
  currentLabel: string;
  parent?: { href: string; label: string };
}

export function AccountsDetailBreadcrumb({ currentLabel, parent }: Props) {
  const accountsHref = useListReturnHref(routes.ACCOUNTS);

  return (
    <nav aria-label="Breadcrumb" className={accountsBreadcrumbNavClass}>
      <Link
        href={routes.OVERVIEW}
        aria-label="Dashboard"
        className={accountsBreadcrumbHomeClass}
      >
        <Home className="size-5" />
      </Link>
      <ChevronRight className={accountsBreadcrumbChevronClass} aria-hidden />
      <Link href={accountsHref} className={accountsBreadcrumbLinkClass}>
        Account management
      </Link>
      {parent && (
        <>
          <ChevronRight
            className={accountsBreadcrumbChevronClass}
            aria-hidden
          />
          <Link href={parent.href} className={accountsBreadcrumbLinkClass}>
            {parent.label}
          </Link>
        </>
      )}
      <ChevronRight className={accountsBreadcrumbChevronClass} aria-hidden />
      <span aria-current="page" className={accountsBreadcrumbCurrentClass}>
        {currentLabel}
      </span>
    </nav>
  );
}
