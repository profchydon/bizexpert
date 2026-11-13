export type IN_STORAGE_STATUS = "in_storage" | "expiring";

export const inStorageStatusMap: Record<
  IN_STORAGE_STATUS,
  {
    className: string;
    variant?: string;
    label: string;
    icon?: React.ReactNode;
  }
> = {
  in_storage: {
    className: "w-fit bg-primary-50 text-primary-700 border-primary-200",
    label: "In Storage",
  },
  expiring: {
    className: "w-fit bg-error-50 text-error-700 border-error-200",
    label: "Expiring",
  },
};
