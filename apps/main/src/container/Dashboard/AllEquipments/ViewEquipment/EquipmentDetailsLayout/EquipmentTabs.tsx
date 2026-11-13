"use client";

import { IEquipment } from "@/types/equipments";
import React, { useEffect, useMemo } from "react";
import EquipmentDetail from "./EquipmentDetail";
import EquipmentDocuments from "./EquipmentDocuments";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { IUserRole } from "@/utils/hasAccess";
import EquipmentNotes from "./EquipmentNotes";
import EquipmentDetailTabs from "../EquipmentDetailTabs";
import { buildEquipmentDetailTabs } from "../equipmentDetailTabItems";
import { resolveEquipmentDetailTab } from "../equipmentDetailTab";

interface Props {
  equipment: IEquipment;
  onImproveScore: () => void;
  onEdit: () => void;
  onViewDetails: () => void;
  onCorrect: () => void;
}

const EquipmentTabs: React.FC<Props> = ({
  equipment,
  onImproveScore,
  onEdit,
  onViewDetails,
  onCorrect,
}) => {
  const param = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const equipID = param?.equipmentId as string;
  const { getUserDetails } = useAuthUserDetail();
  const companyId = useWorkspaceCompanyId();
  const user = getUserDetails();
  const rawTab = searchParams.get("tab");
  const tabs = useMemo(() => buildEquipmentDetailTabs(equipment), [equipment]);
  const visibleTabIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);
  const activeTab = resolveEquipmentDetailTab(rawTab, visibleTabIds);

  useEffect(() => {
    if (rawTab === activeTab) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", activeTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [activeTab, rawTab, router, searchParams]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <EquipmentDetailTabs
      activeTab={activeTab}
      onTabChange={handleTabChange}
      tabs={tabs}
    >
      {activeTab === "overview" ? (
        <EquipmentDetail
          equipment={equipment}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
          onImproveScore={onImproveScore}
          userRole={user?.role as IUserRole}
          onCorrect={onCorrect}
        />
      ) : null}
      {activeTab === "documents" ? (
        <EquipmentDocuments
          companyId={companyId as string}
          equipmentId={equipID}
          documentsData={equipment?.documents || []}
        />
      ) : null}
      {activeTab === "notes" ? <EquipmentNotes equipment={equipment} /> : null}
    </EquipmentDetailTabs>
  );
};

export default EquipmentTabs;
