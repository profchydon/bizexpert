export const removeUserscore = (input: string): string => {
  let result = input?.toLowerCase();
  result = result?.replace(/_/g, " ");
  result = result?.charAt(0).toUpperCase() + result?.slice(1);
  return result;
};
export const addUserscore = (input: string): string => {
  let result = input?.toLowerCase();
  result = result?.replace(/" "/g, "_");
  result = result?.charAt(0).toUpperCase() + result?.slice(1);
  return result;
};
