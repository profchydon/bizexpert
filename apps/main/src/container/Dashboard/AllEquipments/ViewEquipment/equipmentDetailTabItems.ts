import { IEquipment } from "@/types/equipments";

type EquipmentNote = {
  read?: boolean;
};

export type EquipmentDetailTabItem = {
  id: string;
  label: string;
  badge?: number | string;
};

export const buildEquipmentDetailTabs = (
  equipment: IEquipment,
): EquipmentDetailTabItem[] => {
  const notes = (equipment?.note?.[0] as EquipmentNote[] | undefined) ?? [];
  const unreadNotes = notes.filter((note) => note.read === false).length;
  const documentCount = equipment?.documents?.length ?? 0;

  const tabs: EquipmentDetailTabItem[] = [
    { id: "overview", label: "Overview" },
  ];

  tabs.push(
    {
      id: "documents",
      label: "Documents",
      badge: documentCount || undefined,
    },
    {
      id: "notes",
      label: "Notes",
      badge: unreadNotes || undefined,
    },
  );

  return tabs;
};
