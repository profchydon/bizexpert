import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { empty_developer_state } from "@/assets/images";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import routes from "@/routes";
const EmptyStarterKitTable = () => {
  return (
    <div className="grid place-content-center gap-y-8 w-full m-auto mt-9">
      <Image src={empty_developer_state} alt="emptyState" className="mx-auto" />
      <div className="flex flex-col text-center">
        <h5 className="text-gray-900 text-xl font-semibold gap-y-2">
          No items yet
        </h5>
        <p className="text-gray-600 text-sm font-normal">
          Please add items to your catalogs
        </p>
      </div>
      <div className="grid place-content-center text-base font-semibold gap-x-2">
        <Button data-testid="emptystarterkittable-button">
          <Plus />
          Add items
        </Button>
      </div>
    </div>
  );
};

export default EmptyStarterKitTable;
