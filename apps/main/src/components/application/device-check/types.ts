export type Grade = "A" | "B" | "C" | "D";

export type ConditionRating = "Excellent" | "Good" | "Fair" | "Poor";

export interface AccessoryItem {
  name: string;
  present: boolean;
}

export interface DeviceCheckReport {
  grade: Grade;
  condition: { label: string; rating: ConditionRating }[];
  powersOn: boolean | null; // null when the asset type has no power test
  accessories: AccessoryItem[];
  serialVerified: boolean;
  notes: string;
  photos: string[]; // image paths, no captions (vendors don't caption)
  checkedAt: string;
}
