"use client";

import { useEffect, useMemo, useState } from "react";

import { useCheckCatalogRuleConflictsMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/checkCatalogRuleConflicts";
import type { CatalogRuleConflictsPayload } from "@/types/catalogPolicy";

import { ruleToConflictCheckPayload } from "../../conflictPayload";
import type { CatalogRule } from "../../types";
import {
  getConflictSignature,
  requiresConflictAcknowledgement,
} from "../../utilsConflicts";

export function useCreatePolicyConflictCheck({
  catalogId,
  companyId,
  draft,
  enabled,
}: {
  catalogId?: string;
  companyId?: string;
  draft: CatalogRule;
  enabled: boolean;
}) {
  const [checkConflicts, checkState] = useCheckCatalogRuleConflictsMutation();
  const [payload, setPayload] = useState<CatalogRuleConflictsPayload | null>(
    null,
  );
  const [ack, setAck] = useState({ acknowledged: false, signature: "" });
  const requestPayload = useMemo(
    () => ruleToConflictCheckPayload(draft),
    [draft.matchCountries, draft.matchDepartments, draft.matchLevels],
  );
  const conflicts = payload?.conflicts ?? [];
  const signature = getConflictSignature(conflicts);
  const acknowledged = ack.acknowledged && ack.signature === signature;
  const requiresAcknowledgment = requiresConflictAcknowledgement({
    conflicts,
    requiresAcknowledgment: payload?.requires_acknowledgment,
  });
  const hasConflicts = conflicts.length > 0;

  useEffect(() => {
    if (!enabled || !companyId || !catalogId) {
      setPayload(null);
      setAck({ acknowledged: false, signature: "" });
      return;
    }
    let active = true;
    checkConflicts({
      catalogId,
      companyId,
      payload: requestPayload,
    })
      .unwrap()
      .then((response) => {
        if (!active) return;
        setPayload(response.data);
        setAck({ acknowledged: false, signature: "" });
      })
      .catch(() => {
        if (active) setPayload(null);
      });
    return () => {
      active = false;
    };
  }, [catalogId, checkConflicts, companyId, enabled, requestPayload]);

  return {
    acknowledged,
    acknowledgeDisplacement: hasConflicts && acknowledged,
    conflicts,
    hasConflicts,
    isBlocked: hasConflicts && !acknowledged,
    isChecking: checkState.isLoading,
    requiresAcknowledgment,
    setAcknowledged: () => setAck({ acknowledged: true, signature }),
  };
}
