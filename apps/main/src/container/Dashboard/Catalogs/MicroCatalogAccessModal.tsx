"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { lock_catalog_icon } from "@/assets/icons";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";
import routes from "@/routes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

// SETTING_SUBSCRIPTION: "/dashboard/settings?subscription",

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

const MicroCatalogAccess: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const param = useSearchParams();
  const subscription = param.get("subscription");
  const subscriptionPage = () => {
    router.push(`/dashboard/settings?settingsType=subscription`);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
        data-testid="microcatalogaccessmodal-dialog"
      >
        <DialogContent className="md:min-w-[400px] w-[calc(100%-30px)] overflow-y-auto">
          <DialogHeader className="items-center pt-20">
            <Image src={lock_catalog_icon} alt="Micro-Catalog Access icon" />
          </DialogHeader>
          <DialogDescription>
            <p className="text-center text-lg font-IBM Plex Sans font-semibold text-[#101828]">
              Unlock Micro-Catalog Access
            </p>
            <p className="text-center text-sm font-normal">
              To access the micro-catalog feature, please subscribe to one of
              our plans for full access.
            </p>
          </DialogDescription>

          <div className="flex gap-x-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(routes.OVERVIEW)}
              data-testid="microcatalogaccessmodal-button"
            >
              Back to overview
            </Button>
            <Button
              className="w-full"
              onClick={subscriptionPage}
              data-testid="microcatalogaccessmodal-button-2"
            >
              Subscribe now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MicroCatalogAccess;
