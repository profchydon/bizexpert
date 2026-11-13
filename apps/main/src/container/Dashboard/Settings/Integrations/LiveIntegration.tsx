import React, { FC, useState, type ReactElement } from "react";
import IntegrationCard from "./IntegrationCard";
import PageState from "@/components/PageState";
import { I_Configuration, I_LiveIntegrations } from "@/types/integrations";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleWorkspace from "./GoogleWorkspace";
import AppleBusinessManager from "./AppleBusinessManager";
import MicrosoftEntraID from "./MicrosoftEntraID";
import MicrosoftIntune from "./MicrosoftIntune";
import { slug } from "./integrationImages";
import Finch from "./Finch";
import NangoConnect from "./NangoConnect";
import {
  isNangoIntegration,
  isHiddenOnKnowledgeTab,
} from "./nangoRoutingFields";
import { resolveLiveIntegrationKey } from "./liveIntegrationKey";
import {
  buildIntegrationsSettingsPath,
  parseIntegrationCategory,
  parseIntegrationView,
} from "./integrationsSearchParams";
import { useSyncNangoIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/nangoIntegrations";

interface Props {
  companyId: string;
  isLoading: boolean;
  isError: boolean;
  liveData: I_LiveIntegrations[];
}

const LiveIntegration: FC<Props> = ({
  companyId,
  isLoading,
  isError,
  liveData,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openIntegration, setOpenIntegration] = useState<string | null>(null);
  const [syncNango] = useSyncNangoIntegrationMutation();
  const category = parseIntegrationCategory(searchParams.get("category"));
  const integrationView = parseIntegrationView(
    searchParams.get("integrationView"),
  );

  const transformLiveIntegrationsData = liveData
    ?.filter(
      (item) =>
        category !== "knowledge" ||
        !isHiddenOnKnowledgeTab(item?.integration?.slug),
    )
    .map((item: any) => {
      const matchedIcon =
        slug.find((iconItem) => iconItem?.slug === item?.integration?.slug)
          ?.icon || "";

      // Render the component based on the slug
      const isLiveActive = item?.status === "Active";

      let component:
        | ((isOpen: boolean, onClose: () => void) => ReactElement)
        | null = null;

      const closeDialog = () => {
        setOpenIntegration(null);
        router.push(
          buildIntegrationsSettingsPath({ category, view: integrationView }),
        );
      };

      const key = resolveLiveIntegrationKey(item);

      if (isNangoIntegration(item?.integration?.service)) {
        component = (isOpen) => (
          <NangoConnect
            isOpen={isOpen}
            onClose={closeDialog}
            isLive={isLiveActive}
            status={item?.status}
            companyId={companyId}
            service_name={item?.integration?.name}
            service_description={item?.integration?.description}
            slug={item?.integration?.slug}
            icon={matchedIcon}
            rsSyncStatus={item?.rs_sync_status}
            rsSyncError={item?.rs_sync_error}
            nangoConnectionId={item?.nango_connection_id}
            initialRouting={
              item?.configuration as
                | {
                    project_key?: string;
                    board_id?: string;
                    sync_frequency?: string;
                  }
                | undefined
            }
            lastSyncAt={item?.last_sync_at}
          />
        );
      } else {
        switch (key) {
          case "google:google-workspace":
            component = (isOpen, onClose) => (
              <GoogleWorkspace
                isOpen={isOpen}
                onClose={() => {
                  onClose();
                  closeDialog();
                }}
                integration_id={item?.id as string}
                companyId={companyId}
                domain={item?.domain as string}
                configuration={item?.configuration as I_Configuration}
                settings_instance
                isLive={isLiveActive}
                status={item?.status}
              />
            );
            break;
          case "microsoft:microsoft-intune":
            component = (isOpen, onClose) => (
              <MicrosoftIntune
                isOpen={isOpen}
                onClose={onClose}
                integration_id={item?.id as string}
                companyId={companyId}
              />
            );
            break;
          case "apple:apple-business-manager":
            component = (isOpen, onClose) => (
              <AppleBusinessManager
                isOpen={isOpen}
                onClose={onClose}
                integration_id={item?.id as string}
                companyId={companyId}
                settings_instance
                isLive={isLiveActive}
              />
            );
            break;
          case "microsoft:microsoft-entra-id":
            component = (isOpen, onClose) => (
              <MicrosoftEntraID
                isOpen={isOpen}
                onClose={onClose}
                integration_id={item?.id as string}
                companyId={companyId}
                configuration={item?.configuration as I_Configuration}
                settings_instance
                isLive={isLiveActive}
                status={item?.status}
              />
            );
            break;
          case "finch":
            component = (isOpen, onClose) => (
              <Finch
                isOpen={isOpen}
                onClose={onClose}
                integration_id={item?.id as string}
                companyId={companyId}
                configuration={item?.configuration as I_Configuration}
                settings_instance
                isLive={isLiveActive}
                status={item?.status}
                service_name={item?.integration?.name}
                service_description={item?.integration?.description}
                slug={item?.integration?.slug}
                icon={matchedIcon}
              />
            );
            break;
          default:
            component = null;
        }
      }

      return {
        title: item?.integration?.name,
        id: item?.integration?.id,
        description: item?.integration?.description,
        icon: matchedIcon,
        isSetup: item?.status,
        isConfigure: false,
        component: component,
        slug: item?.integration?.slug,
        service: item?.integration?.service,
        isLive: isLiveActive,
        openIntegration,
        setOpenIntegration,
        categories: item?.integration?.categories,
        rsSyncStatus: item?.rs_sync_status,
        rsSyncError: item?.rs_sync_error,
        onRetry:
          isNangoIntegration(item?.integration?.service) &&
          (item?.rs_sync_status === "pending" ||
            item?.rs_sync_status === "failed")
            ? () =>
                syncNango({
                  companyId,
                  payload: { provider: item?.integration?.slug },
                })
            : undefined,
      };
    });
  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {transformLiveIntegrationsData?.map((integration: any) => (
          <IntegrationCard
            {...integration}
            key={integration.id}
            isOpen={
              integration.openIntegration ===
              (integration.service === "nango"
                ? `nango:${integration.slug}`
                : integration.slug)
            }
            onOpen={() =>
              integration.setOpenIntegration(
                integration.service === "nango"
                  ? `nango:${integration.slug}`
                  : integration.slug,
              )
            }
            onClose={() => integration.setOpenIntegration(null)}
          />
        ))}
      </div>
    </PageState>
  );
};

export default LiveIntegration;
