export const getInitials = (name: string): string | null => {
  if (!name) return null;
  const words = name.trim().split(/\s+/);
  const initials = words?.map((word) => word[0]?.toUpperCase())?.join("");

  return initials;
};

/*****************************
 This variable is used for order 
 summaries that dont have assigned users 
*******************************/
export const UNASSIGNED_ORDER_SUMMARY_KEY = "Unassigned";
