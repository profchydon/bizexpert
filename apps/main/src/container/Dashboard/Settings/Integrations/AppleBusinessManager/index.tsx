import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { apple_icon } from "@/assets/icons";
import { MoveUpRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Setup from "./Setup";
import Configure from "./Configure";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { I_IntegrationType } from "@/types/integrations";
import { ActivateAbmIntegrationRequest } from "@/types/integrations";
import { useActivateAbmIntegrationMutation } from "../../../../../api/baseQueries/companiesApi/integrationsApi/activateAbmIntegration";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  code?: string;
  integration?: I_IntegrationType;
  integration_id: string;
  orgId?: string;
  isLive?: boolean;
  settings_instance?: boolean;
}

const AppleBusinessManager: React.FC<Props> = ({
  isOpen,
  onClose,
  companyId,
  code,
  integration,
  integration_id,
  orgId = "",
  isLive = false,
  settings_instance = false,
}) => {
  const [tab, setTab] = useState("setup");

  const [activateAbmIntegration, { isLoading: activateAbm_isLoading }] =
    useActivateAbmIntegrationMutation();

  const handleSave = async (data: { orgId: string }) => {
    const payload = {
      company_id: companyId,
      integration_id,
      other_details: {
        orgId: data.orgId as string,
      },
    };

    const formatData = {
      companyId,
      payload,
    } as ActivateAbmIntegrationRequest;
    return await activateAbmIntegration(formatData)
      .unwrap()
      .then((res) => {
        onClose();
        displaySuccessMessage(
          "Configuration successful",
          "Configuration has been saved succesfully",
        );
      });
  };

  return (
    <Dialog
      open={
        isOpen || (code && integration === "apple-business-manager")
          ? true
          : false
      }
      onOpenChange={onClose}
      data-testid="applebusinessmanager-dialog"
    >
      <DialogContent className="md:min-w-[400px] max-h-[calc(100%-20px)] w-[calc(100%-10px)] flex flex-col overflow-y-auto">
        <DialogHeader className="text-left">
          <Image
            src={apple_icon}
            alt="apple_icon"
            className="max-w-[1.9rem] max-h-[1.9rem]"
          />
          <div className="space-y-2">
            <div className="text-base font-semibold text-gray-900">
              Apple Business Manager
            </div>
            {/* <span className=" text-sm flex items-center">
              Apple Business Manager guide{" "}
              <a className="flex cursor-pointer text-primary-700 items-center">
                <MoveUpRight className="h-4" /> Click here
              </a>
            </span> */}
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
            </div>
            <Separator />
          </TabsList>

          <TabsContent value="setup" className="flex flex-col gap-8">
            <Setup
              onSave={handleSave}
              initialOrgId={orgId}
              isLoading={activateAbm_isLoading}
              isLive={isLive}
              settings_instance={settings_instance}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AppleBusinessManager;
