"use client";

import { FC, PropsWithChildren } from "react";

const AppLayoutWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mt-[72px] page-px">
      <div className="w-full">{children}</div>
    </div>
  );
};

export default AppLayoutWrapper;
