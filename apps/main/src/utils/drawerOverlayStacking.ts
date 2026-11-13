export const ELEVATED_MODAL_OVERLAY_CLASS = "z-[1010]";
export const ELEVATED_MODAL_CONTENT_CLASS = "z-[1011]";
export const CONTAINED_SLIDEOUT_OVERLAY_CLASS = "absolute inset-0 z-[1009]";
export const CONTAINED_SLIDEOUT_CONTENT_CLASS = "absolute z-[1010]";
export const SLIDEOUT_MENU_OVERLAY_CLASS = "z-[1007]";
export const SLIDEOUT_DIALOG_TEST_ID = "slideout-menu-dialog";

export const shouldElevateModalOverDrawer = (returnTo?: string) =>
  returnTo === "employees";

export const getSlideoutDialogElement = () => {
  if (typeof document === "undefined") return undefined;
  return (
    document.querySelector<HTMLElement>(
      `[data-testid="${SLIDEOUT_DIALOG_TEST_ID}"]`,
    ) ?? undefined
  );
};
