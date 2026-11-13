"use client";

import { useState } from "react";
import { useCreateOfficeAreaMutation } from "@/api/baseQueries/companiesApi/officesApi/officeAreas";
import type { ServerOfficeArea } from "@/types/offices";
import type { Office } from "../../types";
import { officeApiErrorMessage } from "../utils/officeApiError";

interface Options {
  office: Office;
  areas: ServerOfficeArea[];
  onSelect: (areaId: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function useOfficeAreaCreate({
  office,
  areas,
  onSelect,
  onNotify,
}: Options) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdArea, setCreatedArea] = useState<ServerOfficeArea | null>(null);
  const [createArea, createResult] = useCreateOfficeAreaMutation();

  const mergedAreas =
    createdArea && !areas.some((area) => area.id === createdArea.id)
      ? [...areas, createdArea]
      : areas;

  async function create(name: string) {
    try {
      const created = await createArea({
        companyId: office.subsidiaryId,
        officeId: office.id,
        payload: { name },
      }).unwrap();
      setIsModalOpen(false);
      const area = created?.data;
      if (area?.id) {
        setCreatedArea(area);
        onSelect(area.id);
      }
      onNotify("Area added", `${name} was added to ${office.name}.`);
    } catch (error) {
      onNotify(
        "Area not saved",
        officeApiErrorMessage(error, `Could not save ${name}.`),
      );
    }
  }

  return {
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    mergedAreas,
    create,
    isCreating: createResult.isLoading,
  };
}
