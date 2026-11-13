export type ExtendedSpecRow = {
  id: string;
  key: string;
  value: string;
};

export type DeviceEntry = {
  id: string;
  deviceName: string;
  assetType: string;
  quantity: string;
  budgetPrice: string;
  description: string;
  extendedSpecs: ExtendedSpecRow[];
};
