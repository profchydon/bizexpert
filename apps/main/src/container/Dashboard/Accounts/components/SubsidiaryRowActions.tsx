"use client";

import ViewNavigateButton from "@/components/ViewNavigateButton";
import { useListDetailHref } from "@/hooks/tableListLocation";
import routes from "@/routes";
import type { Subsidiary } from "../types";

interface Props {
  subsidiary: Subsidiary;
}

export function SubsidiaryRowActions({ subsidiary }: Props) {
  const href = useListDetailHref(routes.SUBSIDIARY_DETAIL(subsidiary.id));

  return (
    <div className="flex items-center justify-end gap-2">
      <ViewNavigateButton href={href} testId="subsidiaryrowactions-button" />
    </div>
  );
}
