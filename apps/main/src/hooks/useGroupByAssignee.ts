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

  data.forEach((asset) => {
    if (asset.assignee) {
      const assigneeId = asset.assignee.id ?? UNASSIGNED_ORDER_SUMMARY_KEY;
      if (!grouped[assigneeId]) {
        grouped[assigneeId] = {
          actionType: asset?.actionType,
          assignee: asset?.assignee,
          receiver: asset?.receiver || null,
          assets: [],
          collectionDate: asset?.collectionDate,
        };
      }
      grouped[assigneeId].assets.push(asset);
    }
  });

  return Object.keys(grouped).map((key) => grouped[key]);
};

const useGroupByAssignee = (initialData = []) => {
  const [groupedData, setGroupedData] = useState();

  useEffect(() => {
    const transform = groupByAssignee(initialData);
    setGroupedData(transform as any);
  }, [initialData]);

  const deleteAssigneeWithoutAssets = useCallback(() => {
    setGroupedData(
      (prevData: any) =>
        prevData?.filter(
          (group: any) => group.assignee && group.assets.length > 0,
        ) || [],
    );
  }, []);

  return { groupedData, deleteAssigneeWithoutAssets, setGroupedData };
};

export default useGroupByAssignee;
