"use client";

import { useMemo, useState } from "react";
import PageState from "@/components/PageState";
import { FloatingAlert } from "@/components/application/alerts/floating-alert";
import { useGetTelemetryDeviceQuery } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import type { IEquipment } from "@/types/equipments";
import { telemetryEligible } from "./telemetry/eligibility";
import { mapLiveTelemetry } from "./telemetry/mapLiveTelemetry";
import { toEquipmentDetail } from "./telemetry/toEquipmentDetail";
import { EquipmentTelemetryLockedState } from "./telemetry/TelemetryLockedState";
import { AgentSetupState } from "./telemetry/ui/AgentSetupState";
import { EmployeeTelemetryView } from "./telemetry/ui/EmployeeTelemetryView";
import { FullTelemetryView } from "./telemetry/ui/FullTelemetryView";
import { RevokedState } from "./telemetry/ui/RevokedState";
import { useRevocation } from "./telemetry/telemetryRevocations";
import { resolveOwnership } from "./telemetry/ownership";

export default function EquipmentTelemetryTab({
  companyId,
  equipmentId,
  equipment,
}: Readonly<{
  companyId: string;
  equipmentId: string;
  equipment: IEquipment;
}>) {
  const telemetryAccess = useEntitlementOn("telemetry_agent");
  const planOk = telemetryAccess.on;
  const [toast, setToast] = useState<string | null>(null);
  const query = useGetTelemetryDeviceQuery(
    { companyId, deviceId: equipmentId },
    { skip: !companyId || !equipmentId || !planOk },
  );
  const revocation = useRevocation(equipmentId);
  const host = useMemo(
    () => toEquipmentDetail(equipment, query.data?.data),
    [equipment, query.data?.data],
  );
  const telemetry = query.data?.data ? mapLiveTelemetry(query.data.data) : null;

  if (!telemetryAccess.ready) {
    return <PageState isLoading isError={false} />;
  }

  if (!planOk) {
    return <EquipmentTelemetryLockedState />;
  }

  if (!telemetryEligible(equipment.type)) {
    return null;
  }

  if (query.isLoading) {
    return <PageState isLoading isError={false} />;
  }

  if (query.isError) {
    return <PageState isLoading={false} isError />;
  }

  if (!telemetry) {
    return null;
  }

  return (
    <>
      {revocation ? (
        <RevokedState
          device={host}
          telemetry={telemetry}
          revocation={revocation}
          onToast={setToast}
        />
      ) : !telemetry.agentInstalled ? (
        <AgentSetupState
          device={host}
          telemetry={telemetry}
          onToast={setToast}
        />
      ) : resolveOwnership(host) === "employee" ? (
        <EmployeeTelemetryView deviceId={host.id} telemetry={telemetry} />
      ) : (
        <FullTelemetryView
          device={host}
          telemetry={telemetry}
          onToast={setToast}
        />
      )}
      <FloatingAlert
        show={Boolean(toast)}
        color="success"
        title={toast ?? ""}
        onDismiss={() => setToast(null)}
      />
    </>
  );
}
