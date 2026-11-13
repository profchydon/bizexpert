"use client";

import Image from "next/image";
import Link from "next/link";
import { logo } from "@/assets/images";
import { isBizExpertApp } from "@/config/product";
import routes from "@/routes";

type Props = {
  isEmployeeNav: boolean;
};

export function NavBrand({ isEmployeeNav }: Props) {
  const href = isEmployeeNav ? routes.EMPLOYEE : routes.DASHBOARD;

  if (isBizExpertApp()) {
    return (
      <Link
        href={href}
        className="shrink-0 text-lg font-semibold tracking-tight text-white"
      >
        BizExpert
      </Link>
    );
  }

  return (
    <Link href={href} className="shrink-0">
      <Image
        src={logo}
        alt="rayda_logo"
        className="h-7 w-auto sm:h-8"
        priority
      />
    </Link>
  );
}
