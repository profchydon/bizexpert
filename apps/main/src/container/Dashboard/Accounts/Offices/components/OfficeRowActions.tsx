"use client";

import ViewNavigateButton from "@/components/ViewNavigateButton";
import { useListDetailHref } from "@/hooks/tableListLocation";
import type { Office } from "../../types";
import { officeDetailHref } from "../utils/officeDetailHref";

export function OfficeRowActions({ office }: { office: Office }) {
  const href = useListDetailHref(officeDetailHref(office));

  return (
    <div className="flex items-center justify-end">
      <ViewNavigateButton href={href} testId="officerowactions-button" />
    </div>
  );
}
