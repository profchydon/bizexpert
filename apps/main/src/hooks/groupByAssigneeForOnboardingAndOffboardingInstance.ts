import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { useEffect, useState, useCallback } from "react";

type GroupedData = {
  [assigneeId: string]: {
    actionType: string;
    assignee: any;
    receiver: any;
    assets: any[];
    collectionDate: any;
  };
};

export const groupByAssignee = (data: any[]) => {
  if (!data || data.length === 0) return [];

  const grouped: GroupedData = {};

  data.forEach((entry) => {
    const assigneeId = entry.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY;

    if (!grouped[assigneeId]) {
      grouped[assigneeId] = {
        actionType: entry.actionType,
        assignee: entry.assignee,
        receiver: entry.receiver ?? null,
        assets: [],
        collectionDate: entry.collectionDate,
      };
    }

    // Add main asset with flowType = 'offboarding'
    if (entry?.id) {
      grouped[assigneeId].assets.push({
        ...entry,
        flowType: "offboarding",
      });
    }

    // Add nested items with flowType = 'onboarding'
    if (Array.isArray(entry.items)) {
      entry.items.forEach((item: any) => {
        grouped[assigneeId].assets.push({
          ...item,
          flowType: "onboarding",
        });
      });
    }
  });

  return Object.values(grouped);
};

const useGroupByAssigneeForOnboardingAndOffboardingInstance = (
  initialData = [],
) => {
  const [groupedData, setGroupedData] = useState<any[]>([]);

  useEffect(() => {
    const transformed = groupByAssignee(initialData);
    setGroupedData(transformed);
  }, [initialData]);

  const deleteAssigneeWithoutAssets = useCallback(() => {
    setGroupedData(
      (prevData) =>
        prevData?.filter(
          (group) => group.assignee && group.assets.length > 0,
        ) || [],
    );
  }, []);

  return { groupedData, deleteAssigneeWithoutAssets, setGroupedData };
};

export default useGroupByAssigneeForOnboardingAndOffboardingInstance;
