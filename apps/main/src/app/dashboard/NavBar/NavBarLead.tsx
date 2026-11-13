"use client";

import { NavBrand } from "./NavBrand";
import NavItems from "./NavItems";

type Props = {
  isEmployeeNav: boolean;
};

export function NavBarLead({ isEmployeeNav }: Props) {
  return (
    <div className="flex min-w-0 items-center gap-x-3 lg:gap-x-4">
      <NavBrand isEmployeeNav={isEmployeeNav} />
      {!isEmployeeNav && (
        <div className="hidden min-w-0 lg:block">
          <NavItems />
        </div>
      )}
    </div>
  );
}
