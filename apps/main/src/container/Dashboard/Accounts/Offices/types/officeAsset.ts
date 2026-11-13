export type DeviceType =
  | "Laptop"
  | "Desktop"
  | "Smartphone"
  | "Tablet"
  | "Display"
  | "Input Device"
  | "Audio / Visual"
  | "Docking Station"
  | "Network Infrastructure"
  | "Security Hardware"
  | "Power / UPS"
  | "Accessory";

export interface OfficeAsset {
  id: string;
  name: string;
  deviceType: string;
  serial: string;
  condition: string;
  assignedTo: string;
  assigneeId: string;
  assigneeName: string;
  officeAreaName: string;
  value: number;
  currency: string;
  awaitingPlacement?: boolean;
}
