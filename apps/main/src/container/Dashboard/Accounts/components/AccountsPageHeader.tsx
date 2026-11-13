"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import routes from "@/routes";

export function AccountsPageHeader() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Account management
        </h1>
        <p className="text-sm text-gray-600">
          Manage your entities and offices. Each entity bills independently,
          with its own currency, card, and credit.
        </p>
      </div>
      <div className="h-px w-full bg-gray-200" />
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2"
      >
        <Link
          href={routes.OVERVIEW}
          aria-label="Dashboard"
          className="rounded-md p-1 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
        >
          <Home className="size-5" />
        </Link>
        <ChevronRight className="size-4 text-gray-400" aria-hidden />
        <span
          aria-current="page"
          className="text-sm font-semibold text-primary-700"
        >
          Account management
        </span>
      </nav>
    </div>
  );
}
