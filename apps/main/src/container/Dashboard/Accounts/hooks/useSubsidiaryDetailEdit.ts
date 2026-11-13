"use client";

import { useEffect, useState } from "react";
import { useUpdateEntityMutation } from "@/api/baseQueries/companiesApi/entitiesApi/updateEntity";
import { entityApiErrorMessage } from "@/api/baseQueries/companiesApi/entitiesApi/entityApiError";
import {
  buildUpdateEntityPayload,
  type UpdateEntityFormValues,
} from "../utils/buildUpdateEntityPayload";

export function useSubsidiaryDetailEdit(entityId: string, entityName: string) {
  const [updateEntity, result] = useUpdateEntityMutation();
  const [savedAlert, setSavedAlert] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (!savedAlert) return;
    const timer = setTimeout(() => setSavedAlert(false), 6000);
    return () => clearTimeout(timer);
  }, [savedAlert]);

  useEffect(() => {
    if (!editError) return;
    const timer = setTimeout(() => setEditError(null), 6000);
    return () => clearTimeout(timer);
  }, [editError]);

  async function submitEdit(
    values: UpdateEntityFormValues,
    onSuccess: () => void,
  ) {
    try {
      await updateEntity({
        entityId,
        body: buildUpdateEntityPayload(values),
      }).unwrap();
      onSuccess();
      setSavedAlert(true);
    } catch (error) {
      setEditError(
        entityApiErrorMessage(error, `Could not update ${entityName}.`),
      );
    }
  }

  return {
    submitEdit,
    isSaving: result.isLoading,
    savedAlert,
    setSavedAlert,
    editError,
    setEditError,
  };
}
