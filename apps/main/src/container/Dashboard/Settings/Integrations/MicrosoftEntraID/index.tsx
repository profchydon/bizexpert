import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { microsoft_entra_icon } from "@/assets/icons";
import { MoveUpRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Setup from "./Setup";
import Configure from "./Configure";
import displaySuccessMessage from "@/utils/displaySuccessMessage";

import {
  ActivationIntegrationRequest,
  I_Configuration,
  I_IntegrationType,
  UpdateLiveIntegrationRequest,
} from "@/types/integrations";
import { useUpdateLiveIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/updateLiveIntegration";
import { useLazyMicrosoftEntraRedirectQuery } from "@/api/baseQueries/companiesApi/integrationsApi/microsoftEntraRedirect";
import { useActivateMicrosoftEntraIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/activateMicrosoftEntraIntegration";
import {
  asRedirectUrl,
  openIntegrationRedirect,
} from "@/utils/auth/openIntegrationRedirect";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  code?: string;
  integration?: I_IntegrationType;
  integration_id: string;
  configuration?: I_Configuration;
  settings_instance?: boolean;
  isLive?: boolean;
  status: "Active" | "Inactive";
}

const MicrosoftEntraID: React.FC<Props> = ({
  isOpen,
  onClose,
  companyId,
  code,
  integration,
  integration_id,
  configuration,
  settings_instance = false,
  isLive = false,
  status,
}) => {
  const [tab, setTab] = useState("setup");

  const [
    microsoftEntraRedirect,
    {
      isLoading: microsoftEntraRedirect_isLoading,
      isFetching: microsoftEntraRedirect_isFetching,
    },
  ] = useLazyMicrosoftEntraRedirectQuery();
  const [
    activateMicrosoftEntraIntegration,
    { isLoading: activateMicrosoftEntra_isLoading },
  ] = useActivateMicrosoftEntraIntegrationMutation();

  const [updateLiveIntegration, { isLoading: updateLive_isLoading }] =
    useUpdateLiveIntegrationMutation();

  const isMicrosoftEntraRedirectLoading =
    microsoftEntraRedirect_isLoading || microsoftEntraRedirect_isFetching;
  const isActivateMicrosoftEntraLoading =
    activateMicrosoftEntra_isLoading || updateLive_isLoading;

  const handleContinue = async () => {
    await openIntegrationRedirect(async () => {
      const session = await microsoftEntraRedirect({ companyId }).unwrap();
      return asRedirectUrl(session.data);
    });
  };

  const handleFinish = async (data: {
    sync_frequency: string;
    excluded_emails: string[];
  }) => {
    if (!settings_instance) {
      const payload = {
        code,
        company_id: companyId,
        integration_id,
        configuration: {
          sync_frequency: data?.sync_frequency as string,
          excluded_emails: data?.excluded_emails as string[],
        },
      };
      const formatData = {
        companyId,
        payload,
      } as ActivationIntegrationRequest;
      return await activateMicrosoftEntraIntegration(formatData)
        .unwrap()
        .then((res) => {
          setTab("setup");
          onClose();
          displaySuccessMessage(
            "Integration successful",
            "Microsoft Entra ID has been succesfully integrated, proceed to configure.",
          );
        });
    }

    const payload = {
      configuration: {
        sync_frequency: data?.sync_frequency as string,
        excluded_emails: data?.excluded_emails as string[],
      },
    };
    const formatData = {
      companyId,
      integration_id,
      payload,
    } as UpdateLiveIntegrationRequest;

    return await updateLiveIntegration(formatData)
      .unwrap()
      .then((res) => {
        onClose();
        displaySuccessMessage(
          "Configuration successful",
          "Configuration has been updated succesfully",
        );
      });
  };

  const handleProceedToConfigure = () => {
    setTab("configure");
  };

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  useEffect(() => {
    if ((code && integration === "microsoft-entra-id") || settings_instance) {
      setTab("configure");
    }
    return;
  }, [code, integration, settings_instance]);

  return (
    <Dialog
      open={
        isOpen || (code && integration === "microsoft-entra-id") ? true : false
      }
      onOpenChange={onClose}
      data-testid="microsoftentraid-dialog"
    >
      <DialogContent className="md:min-w-[400px] max-h-[calc(100%-20px)] w-[calc(100%-10px)] flex flex-col overflow-y-auto">
        <DialogHeader className="text-left">
          <Image
            src={microsoft_entra_icon}
            alt="miscrosoft-icon"
            className="max-w-[1.9rem] max-h-[1.9rem]"
          />
          <div className="space-y-2">
            <div className="text-base font-semibold text-gray-900">
              Microsoft Entra ID
            </div>
            {/* <span className=" text-sm flex items-center">
              Microsoft Entra ID guide{" "}
              <a className="flex cursor-pointer text-primary-700 items-center">
                <MoveUpRight className="h-4" /> Click here
              </a>
            </span> */}
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex flex-col items-start mb-4">
            <div className="flex flex-row">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="configure">Configure</TabsTrigger>
            </div>
            <Separator />
          </TabsList>

          <TabsContent value="setup" className="flex flex-col gap-8">
            <Setup
              isConnected={isLive}
              onContinue={handleContinue}
              isLoading={isMicrosoftEntraRedirectLoading}
              onProceedToConfigure={handleProceedToConfigure}
            />
          </TabsContent>

          <TabsContent value="configure" className="flex flex-col gap-8">
            <Configure
              key={`configure-${integration_id}-${isOpen}`}
              statusState={status}
              code={code as string}
              onFinish={handleFinish}
              isLoading={isActivateMicrosoftEntraLoading}
              configuration={configuration}
              settings_instance={settings_instance}
              companyId={companyId}
              integration_id={integration_id}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MicrosoftEntraID;
