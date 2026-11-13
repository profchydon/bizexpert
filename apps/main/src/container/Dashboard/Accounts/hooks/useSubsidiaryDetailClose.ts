"use client";

import { useEffect, useState } from "react";
import { useCloseEntityAction } from "./useCloseEntityAction";

export function useSubsidiaryDetailClose(entityId: string, entityName: string) {
  const { closeEntity, isClosing } = useCloseEntityAction(entityId, entityName);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closedAlert, setClosedAlert] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);

  useEffect(() => {
    if (!closedAlert) return;
    const timer = setTimeout(() => setClosedAlert(false), 6000);
    return () => clearTimeout(timer);
  }, [closedAlert]);

  useEffect(() => {
    if (!closeError) return;
    const timer = setTimeout(() => setCloseError(null), 6000);
    return () => clearTimeout(timer);
  }, [closeError]);

  async function handleCloseEntity(onClosed: () => void) {
    await closeEntity(
      () => {
        onClosed();
        setCloseOpen(false);
        setClosedAlert(true);
      },
      (message) => setCloseError(message),
    );
  }

  return {
    closeOpen,
    setCloseOpen,
    closedAlert,
    setClosedAlert,
    closeError,
    setCloseError,
    isClosing,
    handleCloseEntity,
  };
}
