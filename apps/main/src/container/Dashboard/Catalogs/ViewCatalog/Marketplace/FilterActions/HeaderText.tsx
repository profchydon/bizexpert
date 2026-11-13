import { Separator } from "@/components/ui/separator";
import React from "react";

const HeaderText = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <h3 className="text-gray-900 text-lg font-semibold">Filter</h3>
      <p className="text-gray-600 text-sm font-normal">
        Find the right hardware for your team
      </p>
      <Separator className="mt-[1.0625rem]" />
    </div>
  );
};

export default HeaderText;
