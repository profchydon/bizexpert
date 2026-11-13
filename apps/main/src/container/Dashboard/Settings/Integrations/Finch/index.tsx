import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Setup from "./Setup";
import Configure from "./Configure";
import { I_Configuration, I_IntegrationType } from "@/types/integrations";
import {
  ELEVATED_MODAL_CONTENT_CLASS,
  ELEVATED_MODAL_OVERLAY_CLASS,
  shouldElevateModalOverDrawer,
} from "@/utils/drawerOverlayStacking";
import { cn } from "@/lib/utils";
import { shouldOpenFinchConfigureTab } from "@/utils/finchAuthorizationCode";
import { useFinchConnectActions } from "./useFinchConnectActions";

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
  service_name: string;
  service_description: string;
  slug: string;
  icon: string;
  returnTo?: string;
}

const Finch: React.FC<Props> = ({
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
  service_name,
  slug,
  icon,
  returnTo,
}) => {
  const [tab, setTab] = useState("setup");
  const {
    handleContinue,
    handleFinish,
    isFinchRedirectLoading,
    isActivateFinchLoading,
  } = useFinchConnectActions({
    companyId,
    code,
    integration_id,
    slug,
    service_name,
    settings_instance,
    returnTo,
    onClose,
    setTab,
  });

  useEffect(() => {
    if (
      shouldOpenFinchConfigureTab({
        code,
        integration,
        slug,
        settingsInstance: settings_instance,
      })
    ) {
      setTab("configure");
    }
  }, [code, integration, settings_instance, slug]);

  const elevateOverDrawer = shouldElevateModalOverDrawer(returnTo);

  return (
    <Dialog
      open={isOpen || (code && integration === slug) ? true : false}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      data-testid="finch-dialog"
    >
      <DialogContent
        className={cn(
          "md:min-w-[400px] max-h-[calc(100%-20px)] w-[calc(100%-10px)] flex flex-col overflow-y-auto",
          elevateOverDrawer && ELEVATED_MODAL_CONTENT_CLASS,
        )}
        overlayClassName={
          elevateOverDrawer ? ELEVATED_MODAL_OVERLAY_CLASS : undefined
        }
      >
        <DialogHeader className="text-left">
          <Image
            src={icon || ""}
            alt={`${service_name}-icon`}
            className="max-w-[1.9rem] max-h-[1.9rem]"
          />
          <div className="space-y-2">
            <div className="text-base font-semibold text-gray-900">
              {service_name}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
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
              isLoading={isFinchRedirectLoading}
              onProceedToConfigure={() => setTab("configure")}
              service_name={service_name}
            />
          </TabsContent>

          <TabsContent value="configure" className="flex flex-col gap-8">
            <Configure
              key={`configure-${integration_id}-${isOpen}`}
              statusState={status}
              code={code as string}
              onFinish={handleFinish}
              isLoading={isActivateFinchLoading}
              service_name={service_name}
              configuration={configuration}
              settings_instance={settings_instance}
              companyId={companyId}
              integration_id={integration_id}
              onClose={onClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Finch;
