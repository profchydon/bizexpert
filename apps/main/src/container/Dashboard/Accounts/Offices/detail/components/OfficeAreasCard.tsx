"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCreateOfficeAreaMutation,
  useDeleteOfficeAreaMutation,
  useUpdateOfficeAreaMutation,
} from "@/api/baseQueries/companiesApi/officesApi/officeAreas";
import type { ServerOfficeArea } from "@/types/offices";
import type { Office } from "../../../types";
import { officeApiErrorMessage } from "../../utils/officeApiError";
import { OfficeAreaModal } from "./OfficeAreaModal";
import { OfficeAreaRow } from "./OfficeAreaRow";
import { OfficeSectionCard } from "./OfficeSectionCard";
import { RemoveOfficeAreaModal } from "./RemoveOfficeAreaModal";

interface Props {
  office: Office;
  areas: ServerOfficeArea[];
  canManage: boolean;
  onNotify: (title: string, description: string) => void;
}

export function OfficeAreasCard({ office, areas, canManage, onNotify }: Props) {
  const companyId = office.subsidiaryId;
  const [modal, setModal] = useState<{
    mode: "add" | "rename";
    area?: ServerOfficeArea;
  } | null>(null);
  const [areaToRemove, setAreaToRemove] = useState<ServerOfficeArea | null>(
    null,
  );
  const [createArea, createResult] = useCreateOfficeAreaMutation();
  const [updateArea, updateResult] = useUpdateOfficeAreaMutation();
  const [removeArea, removeResult] = useDeleteOfficeAreaMutation();

  async function handleSubmit(name: string) {
    if (!modal || !companyId) return;
    try {
      if (modal.mode === "add") {
        await createArea({
          companyId,
          officeId: office.id,
          payload: { name },
        }).unwrap();
        onNotify("Area added", `${name} was added to ${office.name}.`);
      } else if (modal.area) {
        await updateArea({
          companyId,
          officeId: office.id,
          areaId: modal.area.id,
          payload: { name },
        }).unwrap();
        onNotify("Area renamed", `${modal.area.name} is now ${name}.`);
      }
      setModal(null);
    } catch (error) {
      onNotify(
        "Area not saved",
        officeApiErrorMessage(error, `Could not save ${name}.`),
      );
    }
  }

  async function handleRemove() {
    if (!areaToRemove || !companyId) return;
    const { id, name, asset_count } = areaToRemove;
    if ((asset_count ?? 0) > 0) return;
    try {
      await removeArea({
        companyId,
        officeId: office.id,
        areaId: id,
      }).unwrap();
      setAreaToRemove(null);
      onNotify("Area removed", `${name} was removed from ${office.name}.`);
    } catch (error) {
      onNotify(
        "Area not removed",
        officeApiErrorMessage(error, `Could not remove ${name}.`),
      );
    }
  }

  const countBadge = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-default">
            <Badge color="brand" size="sm" type="pill-color">
              {areas.length}
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Named areas inside this office where assets can sit.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <>
      <OfficeSectionCard
        title="Office areas"
        badge={countBadge}
        action={
          canManage ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModal({ mode: "add" })}
              data-testid="officeareascard-button"
            >
              <Plus className="mr-2 size-4" />
              Add area
            </Button>
          ) : undefined
        }
      >
        {areas.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-600">
            Add areas like Reception or Server room to organise where assets
            sit.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {areas.map((area) => (
              <OfficeAreaRow
                key={area.id}
                area={area}
                canManage={canManage}
                isRemoving={
                  removeResult.isLoading && areaToRemove?.id === area.id
                }
                onRename={() => setModal({ mode: "rename", area })}
                onRemove={() => setAreaToRemove(area)}
              />
            ))}
          </ul>
        )}
      </OfficeSectionCard>
      <OfficeAreaModal
        isOpen={Boolean(modal)}
        mode={modal?.mode ?? "add"}
        current={modal?.area?.name}
        existing={areas.map((area) => area.name)}
        isSubmitting={createResult.isLoading || updateResult.isLoading}
        onClose={() => setModal(null)}
        onSubmit={handleSubmit}
      />
      <RemoveOfficeAreaModal
        area={areaToRemove}
        isOpen={Boolean(areaToRemove)}
        isRemoving={removeResult.isLoading}
        onClose={() => setAreaToRemove(null)}
        onConfirm={handleRemove}
      />
    </>
  );
}
