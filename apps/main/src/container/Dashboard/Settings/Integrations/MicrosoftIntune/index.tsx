import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { microsoft_icon } from "@/assets/icons";
import { Copy, MoveUpRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Setup from "./Setup";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import Configure from "./Configure";
import { I_IntegrationType } from "@/types/integrations";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  code?: string;
  integration?: I_IntegrationType;
  integration_id: string;
}

const MicrosoftIntune: React.FC<Props> = ({
  isOpen,
  onClose,
  companyId,
  code,
  integration,
  integration_id,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [tab, setTab] = useState("setup");

  useEffect(() => {
    if (code && integration === "microsoft-intune") {
      setTab("configure");
    }
    return;
  }, [code, integration]);
  return (
    <Dialog
      open={
        isOpen || (code && integration === "microsoft-intune") ? true : false
      }
      onOpenChange={onClose}
      data-testid="microsoftintune-dialog"
    >
      <DialogContent className="md:min-w-[400px] max-h-[calc(100%-20px)] w-[calc(100%-10px)] flex flex-col overflow-y-auto">
        <DialogHeader className="text-left">
          <Image
            src={microsoft_icon}
            alt="miscrosoft-icon"
            className="max-w-[1.9rem] max-h-[1.9rem]"
          />
          <div className="space-y-2">
            <div className="text-base font-semibold text-gray-900">
              Microsoft Intune
            </div>
            <span className=" text-sm flex items-center">
              Microsoft Intune guide{" "}
              <a className="flex cursor-pointer text-primary-700 items-center">
                <MoveUpRight className="h-4" /> Click here
              </a>
            </span>
          </div>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value)}
          className="w-full"
        >
          <TabsList className="flex flex-col items-start mb-4">
            <div className="flex flex-row">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="configure">Configure</TabsTrigger>
            </div>
            <Separator />
          </TabsList>

          <TabsContent value="setup" className="flex flex-col gap-8">
            <Setup
              onContinue={() => {
                setTab("configure");
                setIsConnected(true);
                displaySuccessMessage(
                  "Integration successful",
                  "Microsoft Intune has been succesfully integrated, proceed to configure.",
                );
              }}
            />
          </TabsContent>

          <TabsContent value="configure" className="flex flex-col gap-8">
            <Configure
              onContinue={() => {
                setIsConnected(false);
                setTab("setup");
                onClose();
                displaySuccessMessage(
                  "Configuration successful",
                  "Configuration has been saved succesfully",
                );
              }}
              isConnected={isConnected}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MicrosoftIntune;
