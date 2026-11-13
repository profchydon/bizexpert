export type Disposition = "STORE" | "DISPOSE" | "REASSIGN";

export type WipeType =
  "Full Factory Reset" | "Destruction Certificate" | "None";

export interface ReassignTarget {
  id: string;
  name: string;
  role?: string;
  country?: string;
}

export interface DeviceLine {
  id: string;
  equipmentId?: string;
  name: string;
  serial: string;
  imageUrl: string | null;
  assetType?: string;
  disposition: Disposition;
  wipeType: WipeType;
  fee: number;
  reassignTarget?: ReassignTarget;
}

export interface DateWindow {
  start: string;
  end: string;
}

export interface OffboardReviewEmployee {
  id: string;
  name: string;
  role?: string;
  country?: string;
  window?: DateWindow;
  devices: DeviceLine[];
}
