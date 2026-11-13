import { IEquipment } from "./equipments";

export interface IRenewStorage extends IEquipment {
  storageDuration: string;
  collectionDate: string;
  statusFlow?: "Completed" | null;
  actionType: "Store";
}
