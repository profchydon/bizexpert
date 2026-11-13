"use client";

import routes from "@/routes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { marketplaceWithOffice } from "../officeMarketplace";

interface ProductDetailsPageHeaderProps {
  productTitle: string;
}

function ProductDetailsPageHeader({
  productTitle,
}: ProductDetailsPageHeaderProps) {
  const officeId = useSearchParams().get("office");
  const marketplaceHref = marketplaceWithOffice(officeId);

  return (
    <div className="w-full page-px">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl leading-8 font-semibold text-gray-900">
            {productTitle}
          </h1>
          <p className="text-base leading-6 text-gray-600">Marketplace</p>
        </div>

        <Separator />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          href={routes.EQUIP_EMPLOYEE}
          className="text-gray-500 transition hover:text-gray-700"
        >
          <Home className="h-5 w-5" />
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-300" />

        <Link
          href={marketplaceHref}
          className="text-sm font-medium text-gray-600 transition hover:text-gray-800"
        >
          Marketplace
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-300" />

        <span className="max-w-[65ch] truncate text-sm font-semibold text-primary-600">
          {productTitle}
        </span>
      </div>
    </div>
  );
}

export default ProductDetailsPageHeader;
