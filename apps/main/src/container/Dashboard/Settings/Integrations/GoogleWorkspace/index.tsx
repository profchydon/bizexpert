import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { google_icon } from "@/assets/icons";
import { MoveUpRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Setup from "./Setup";
import Configure from "./Configure";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useLazyGoogleRedirectQuery } from "@/api/baseQueries/companiesApi/integrationsApi/googleRedirect";
import {
  ActivationIntegrationRequest,
  I_Configuration,
  I_IntegrationType,
  UpdateLiveIntegrationRequest,
} from "@/types/integrations";
import { useActivateGoogleIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/activateGoogleIntegration";
import { useUpdateLiveIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/updateLiveIntegration";
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
  domain?: string;
  configuration?: I_Configuration;
  settings_instance?: boolean;
  isLive?: boolean;
  status: "Active" | "Inactive";
}

const GoogleWorkspace: React.FC<Props> = ({
  isOpen,
  onClose,
  companyId,
  code,
  integration,
  integration_id,
  domain,
  configuration,
  settings_instance = false,
  isLive = false,
  status,
}) => {
  const [tab, setTab] = useState("setup");

  const [
    googleRedirect,
    {
      isLoading: googleRedirect_isLoading,
      isFetching: googleRedirect_isFetching,
    },
  ] = useLazyGoogleRedirectQuery();
  const [activateGoogleIntegration, { isLoading: activateGoogle_isLoading }] =
    useActivateGoogleIntegrationMutation();
  const [updateLiveIntegration, { isLoading: updateLive_isLoading }] =
    useUpdateLiveIntegrationMutation();

  const isGoogleRedirectLoading =
    googleRedirect_isLoading || googleRedirect_isFetching;
  const isActivateGoogleLoading =
    activateGoogle_isLoading || updateLive_isLoading;

  const handleContinue = async () => {
    await openIntegrationRedirect(async () => {
      const session = await googleRedirect({ companyId }).unwrap();
      return asRedirectUrl(session.data);
    });
  };

  const handleFinish = async (data: {
    domain: string;
    sync_frequency: string;
    excluded_emails: string[];
  }) => {
    if (!settings_instance) {
      const payload = {
        code,
        domain: data?.domain as string,
        company_id: companyId,
        integration_id,
        configuration: {
          sync_frequency: data?.sync_frequency as string,
          excluded_emails: data?.excluded_emails as string[],
        },
      };

      // console.log("=== DEBUG: Payload ===", payload);
      // return;
      const formatData = {
        companyId,
        payload,
      } as ActivationIntegrationRequest;
      return await activateGoogleIntegration(formatData)
        .unwrap()
        .then((res) => {
          setTab("setup");
          onClose();
          displaySuccessMessage(
            "Configuration successful",
            "Configuration has been saved succesfully",
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
    if ((code && integration === "google-workspace") || settings_instance) {
      setTab("configure");
    }
    return;
  }, [code, integration, settings_instance]);

  return (
    <Dialog
      open={
        isOpen || (code && integration === "google-workspace") ? true : false
      }
      onOpenChange={onClose}
      data-testid="googleworkspace-dialog"
    >
      <DialogContent className="md:min-w-[400px] max-h-[calc(100%-20px)] w-[calc(100%-10px)] flex flex-col overflow-y-auto">
        <DialogHeader className="text-left">
          <Image
            src={google_icon}
            alt="google-icon"
            className="max-w-[1.9rem] max-h-[1.9rem]"
          />
          <div className="space-y-2">
            <div className="text-base font-semibold text-gray-900">
              Google Workspace
            </div>
            {/* <span className=" text-sm flex items-center">
              Google workspace guide{" "}
              <a className="flex cursor-pointer text-primary-700 items-center">
                <MoveUpRight className="h-4" /> Click here
              </a>
            </span> */}
          </div>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={handleTabChange}
          // onValueChange={(value) => setTab(value)}
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
              isConnected={isLive}
              onContinue={handleContinue}
              isLoading={isGoogleRedirectLoading}
              onProceedToConfigure={handleProceedToConfigure}
            />
          </TabsContent>

          <TabsContent value="configure" className="flex flex-col gap-8">
            <Configure
              key={`configure-${integration_id}-${isOpen}`}
              statusState={status}
              code={code as string}
              onFinish={handleFinish}
              isLoading={isActivateGoogleLoading}
              domain={domain}
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

export default GoogleWorkspace;
