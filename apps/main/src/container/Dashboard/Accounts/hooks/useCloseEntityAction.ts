"use client";

import { useCloseEntityMutation } from "@/api/baseQueries/companiesApi/entitiesApi/closeEntity";
import { entityApiErrorMessage } from "@/api/baseQueries/companiesApi/entitiesApi/entityApiError";

export function useCloseEntityAction(entityId: string, entityName: string) {
  const [closeEntity, closeResult] = useCloseEntityMutation();

  async function submit(
    onSuccess: () => void,
    onError: (message: string) => void,
  ) {
    try {
      await closeEntity({ entityId }).unwrap();
      onSuccess();
    } catch (error) {
      onError(entityApiErrorMessage(error, `Could not close ${entityName}.`));
    }
  }

  return {
    closeEntity: submit,
    isClosing: closeResult.isLoading,
  };
}
