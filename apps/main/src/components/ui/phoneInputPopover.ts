export const DRAWER_RIGHT_DEFAULT_Z_INDEX = 1007;
export const PHONE_COUNTRY_POPOVER_Z_INDEX = 100000;
export const PHONE_COUNTRY_POPOVER_Z_CLASS = "z-[100000]";

export function phoneCountryPopoverSitsAboveDrawer(
  drawerZIndex = DRAWER_RIGHT_DEFAULT_Z_INDEX,
  popoverZIndex = PHONE_COUNTRY_POPOVER_Z_INDEX,
): boolean {
  return popoverZIndex > drawerZIndex;
}
