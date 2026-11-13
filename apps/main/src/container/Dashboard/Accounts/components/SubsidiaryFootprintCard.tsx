"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import routes from "@/routes";
import type { EntityFootprintCounts } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityFootprint";
import type { Subsidiary } from "../types";

export function SubsidiaryFootprintCard({
  subsidiary,
  footprint,
}: {
  subsidiary: Subsidiary;
  footprint: EntityFootprintCounts;
}) {
  const tiles = [
    {
      label: "Employees",
      count: footprint.employees,
      href: `${routes.EMPLOYEES}?entity=${subsidiary.id}`,
    },
    {
      label: "Assets",
      count: footprint.assets,
      href: `${routes.All_Equipments}?entity=${subsidiary.id}`,
    },
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-xslg">
      <div className="px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">
          Entity footprint
        </h2>
      </div>
      <div className="border-t border-gray-200" />
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="group flex flex-col gap-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 transition hover:border-gray-300 hover:shadow-sm"
          >
            <span className="text-2xl font-semibold tabular-nums text-gray-900">
              {tile.count}
            </span>
            <span className="flex items-center justify-between text-sm text-gray-600">
              {tile.label}
              <ArrowRight className="size-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-primary-700" />
            </span>
          </Link>
        ))}
      </div>
      <p className="px-5 pb-5 text-xs text-gray-600">
        Each tile opens its list filtered to {subsidiary.name}.
      </p>
    </section>
  );
}
