"use client";

import React, { useState } from "react";
import QuickActionCard from "./components/QuickActionCard";
import { overviewQuickActionGridClass } from "./overviewDashboardClasses";
import { isOverviewQuickActionEnabled } from "./overviewQuickActionRules";
import { overviewQuickActions } from "./overviewQuickActions";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import RecipientPickerModal from "../EquipEmployee/RecipientPickerModal";

const DoingTodayQuickActions = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const features = company?.subscription?.plan?.features?.map(
    (feature) => feature.name,
  );
  const [equipOpen, setEquipOpen] = useState(false);

  return (
    <div className={overviewQuickActionGridClass}>
      {overviewQuickActions.map((action) => (
        <QuickActionCard
          key={action.id}
          {...action}
          enabled={isOverviewQuickActionEnabled(action, features)}
          onClick={
            action.id === "action-equip" ? () => setEquipOpen(true) : undefined
          }
        />
      ))}
      <RecipientPickerModal
        isOpen={equipOpen}
        onClose={() => setEquipOpen(false)}
      />
    </div>
  );
};

export default DoingTodayQuickActions;
