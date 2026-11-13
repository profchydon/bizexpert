import { IEquipment } from "./equipments";

export interface IRefreshDevice extends IEquipment {
  statusFlow?: "Completed" | null;
  actionType: "Offboarding" | "Onboarding";
}
