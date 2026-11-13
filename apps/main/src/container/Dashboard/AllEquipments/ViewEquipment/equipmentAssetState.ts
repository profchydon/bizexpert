export const getEquipmentStatusBandClass = (status?: string | null) => {
  const normalized = (status ?? "").toLowerCase().replace(/\s+/g, "_");

  const map: Record<string, string> = {
    assigned: "bg-utility-success-50 text-utility-success-700",
    active: "bg-utility-success-50 text-utility-success-700",
    in_storage: "bg-utility-blue-50 text-utility-blue-700",
    unassigned: "bg-secondary text-tertiary",
    sold: "bg-utility-purple-50 text-utility-purple-700",
    archived: "bg-utility-orange-50 text-utility-orange-700",
    request_sale: "bg-utility-purple-50 text-utility-purple-700",
    request_storage: "bg-utility-blue-50 text-utility-blue-700",
    in_transit: "bg-secondary text-tertiary",
    pending_pickup: "bg-secondary text-tertiary",
    leased: "bg-utility-brand-50 text-utility-brand-700",
  };

  return map[normalized] ?? "bg-secondary text-tertiary";
};

export const shouldShowEquipmentAssignee = (status?: string | null) => {
  const normalized = (status ?? "").toLowerCase().replace(/\s+/g, "_");
  return ["assigned", "active"].includes(normalized);
};
