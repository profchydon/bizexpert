export const ENTITY_CREATE_PENDING_KEY = "entity_create_pending";

export type EntityCardSetupStatus = "success" | "cancelled";

export type PendingEntityCreate = {
  name: string;
  entityId: string;
  sessionId?: string | null;
};

export function readEntityCardSetupStatus(
  value: string | null,
): EntityCardSetupStatus | null {
  if (value === "success" || value === "cancelled") {
    return value;
  }
  return null;
}

export function stashPendingEntityCreate(pending: PendingEntityCreate) {
  if (typeof window === "undefined") return;
  const payload: PendingEntityCreate = {
    name: pending.name.trim(),
    entityId: pending.entityId,
    sessionId: pending.sessionId ?? null,
  };
  sessionStorage.setItem(ENTITY_CREATE_PENDING_KEY, JSON.stringify(payload));
}

export function peekPendingEntityCreate(): PendingEntityCreate | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(ENTITY_CREATE_PENDING_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PendingEntityCreate>;
    const name = parsed?.name?.trim();
    const entityId = parsed?.entityId?.trim();
    if (name && entityId) {
      return {
        name,
        entityId,
        sessionId: parsed.sessionId ?? null,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function clearPendingEntityCreate() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ENTITY_CREATE_PENDING_KEY);
}

export function consumePendingEntityCreate(): PendingEntityCreate | null {
  const pending = peekPendingEntityCreate();
  clearPendingEntityCreate();
  return pending;
}

export type CreateEntityReturnDone = {
  name: string;
  stalled: boolean;
};

export function mapCardSetupToDoneState(
  pending: PendingEntityCreate | null,
  status: EntityCardSetupStatus,
) {
  if (!pending) return null;
  return {
    name: pending.name,
    stalled: status === "cancelled",
  };
}

export function cardSetupReturnDoneState(status: EntityCardSetupStatus) {
  return mapCardSetupToDoneState(consumePendingEntityCreate(), status);
}
