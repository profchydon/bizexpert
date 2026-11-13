export const getDescription = (
  mode: "single" | "bulk",
  isSelectable: boolean,
) => {
  if (mode === "bulk") {
    return "You are about to verify all pending delivery and pickup details for the selected employees.";
  }
  if (isSelectable) {
    return "Select which details you'd like to verify for this employee.";
  }
  return "You are about to verify this employee's delivery details.";
};

export const getConfirmLabel = (
  mode: "single" | "bulk",
  isSelectable: boolean,
) => {
  if (isSelectable) return "Verify selected";
  if (mode === "bulk") return "Verify all";
  return "Verify address";
};

export const getSelectAllState = (
  all: boolean,
  some: boolean,
): boolean | "indeterminate" => {
  if (all) return true;
  if (some) return "indeterminate";
  return false;
};
