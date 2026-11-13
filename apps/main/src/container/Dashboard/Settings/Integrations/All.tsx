import { FC, useEffect, useState, type ReactElement } from "react";
import IntegrationCard from "./IntegrationCard";
import GoogleWorkspace from "./GoogleWorkspace";
import MicrosoftIntune from "./MicrosoftIntune";
import AppleBusinessManager from "./AppleBusinessManager";
import MicrosoftEntraID from "./MicrosoftEntraID";
import { useRouter, useSearchParams } from "next/navigation";
import {
  I_Configuration,
  I_Integration,
  I_IntegrationType,
  I_LiveIntegrations,
} from "@/types/integrations";
import Finch from "./Finch";
import NangoConnect from "./NangoConnect";
import { slug } from "./integrationImages";
import PageState from "@/components/PageState";
import Pagination from "@/components/Custom/Pagination";
import {
  isNangoIntegration,
  isHiddenOnKnowledgeTab,
} from "./nangoRoutingFields";
import {
  buildIntegrationsSettingsPath,
  parseIntegrationCategory,
  parseIntegrationView,
} from "./integrationsSearchParams";
import { useSyncNangoIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/nangoIntegrations";

interface Props {
  integrationsData: I_Integration[];
  companyId: string;
  isLoading: boolean;
  isError: boolean;
  liveData: I_LiveIntegrations[];
  currentPage: number;
  lastPage: number;
  setPage: (page: number) => void;
}

const All: FC<Props> = ({
  integrationsData,
  companyId,
  liveData,
  currentPage,
  lastPage,
  setPage,
  isLoading,
  isError,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string;
  const integration = searchParams.get("integration") as I_IntegrationType;

  const [syncNango] = useSyncNangoIntegrationMutation();
  const category = parseIntegrationCategory(searchParams.get("category"));
  const integrationView = parseIntegrationView(
    searchParams.get("integrationView"),
  );

  const [openIntegration, setOpenIntegration] = useState<string | null>(null);

  useEffect(() => {
    setOpenIntegration(integration);
  }, [integration]);

  const transformIntegrationsData = integrationsData
    ?.filter(
      (item) => category !== "knowledge" || !isHiddenOnKnowledgeTab(item.slug),
    )
    .map((item: any) => {
      const matchedIcon =
        slug.find((iconItem) => iconItem.slug === item.slug)?.icon || "";

      const getLiveProperties = liveData.find(
        (liveIntegration) => liveIntegration.integration?.id === item?.id,
      ) as I_LiveIntegrations;

      const hasLiveIntegration = Boolean(getLiveProperties);
      const isLiveActive = getLiveProperties?.status === "Active";

      let component:
        | ((isOpen: boolean, onClose: () => void) => ReactElement)
        | null = null;

      const handleClose = () => {
        setOpenIntegration(null);
        router.push(
          buildIntegrationsSettingsPath({ category, view: integrationView }),
        );
      };
      const key =
        item.service !== "finch"
          ? `${item?.service}:${item?.slug}`
          : item.service;

      if (isNangoIntegration(item.service)) {
        component = (isOpen, onClose) => (
          <NangoConnect
            isOpen={isOpen}
            onClose={handleClose}
            isLive={isLiveActive}
            status={getLiveProperties?.status ?? "Inactive"}
            companyId={companyId}
            service_name={item?.name}
            service_description={item?.description}
            slug={item?.slug}
            icon={matchedIcon}
            rsSyncStatus={getLiveProperties?.rs_sync_status}
            rsSyncError={getLiveProperties?.rs_sync_error}
            nangoConnectionId={getLiveProperties?.nango_connection_id}
            initialRouting={
              getLiveProperties?.configuration as
                | {
                    project_key?: string;
                    board_id?: string;
                    sync_frequency?: string;
                  }
                | undefined
            }
            lastSyncAt={getLiveProperties?.last_sync_at}
          />
        );
      } else {
        switch (key) {
          case "google:google-workspace":
            component = (isOpen, onClose) => (
              <GoogleWorkspace
                isOpen={isOpen}
                onClose={handleClose}
                code={code}
                isLive={isLiveActive}
                status={getLiveProperties?.status}
                integration={integration}
                integration_id={
                  hasLiveIntegration ? getLiveProperties?.id : item?.id
                }
                companyId={companyId}
                domain={getLiveProperties?.domain as string}
                configuration={
                  getLiveProperties?.configuration as I_Configuration
                }
                settings_instance={hasLiveIntegration}
              />
            );
            break;

          case "microsoft:microsoft-intune":
            component = (isOpen, onClose) => (
              <MicrosoftIntune
                isOpen={isOpen}
                onClose={handleClose}
                code={code}
                integration={integration}
                integration_id={item?.id as string}
                companyId={companyId}
              />
            );
            break;

          case "apple:apple-business-manager":
            component = (isOpen, onClose) => (
              <AppleBusinessManager
                isOpen={isOpen}
                onClose={handleClose}
                code={code}
                integration={integration}
                integration_id={item?.id as string}
                companyId={companyId}
                isLive={isLiveActive}
                settings_instance={isLiveActive}
              />
            );
            break;

          case "microsoft:microsoft-entra-id":
            component = (isOpen, onClose) => (
              <MicrosoftEntraID
                isOpen={isOpen}
                onClose={handleClose}
                code={code}
                isLive={isLiveActive}
                status={getLiveProperties?.status}
                integration={integration}
                integration_id={
                  hasLiveIntegration ? getLiveProperties?.id : item?.id
                }
                companyId={companyId}
                configuration={
                  getLiveProperties?.configuration as I_Configuration
                }
                settings_instance={hasLiveIntegration}
              />
            );
            break;
          case "finch":
            component = (isOpen, onClose) => (
              <Finch
                isOpen={isOpen}
                onClose={handleClose}
                code={code}
                isLive={isLiveActive}
                status={getLiveProperties?.status}
                integration={integration}
                integration_id={
                  hasLiveIntegration ? getLiveProperties?.id : item?.id
                }
                companyId={companyId}
                domain={getLiveProperties?.domain as string}
                configuration={
                  getLiveProperties?.configuration as I_Configuration
                }
                settings_instance={hasLiveIntegration}
                service_name={item?.name}
                service_description={item?.description}
                slug={item?.slug}
                icon={matchedIcon}
              />
            );
            break;
          default:
            component = null;
        }
      }
      return {
        title: item.name,
        id: item.id,
        description: item.description,
        icon: matchedIcon,
        isSetup: item.status,
        isConfigure: false,
        component: component,
        slug: item.slug,
        code,
        isLive: isLiveActive,
        openIntegration,
        setOpenIntegration,
        liveData,
        companyId,
        service: item.service,
        categories: item.categories,
        rsSyncStatus: getLiveProperties?.rs_sync_status,
        rsSyncError: getLiveProperties?.rs_sync_error,
        onRetry:
          isNangoIntegration(item.service) &&
          (getLiveProperties?.rs_sync_status === "pending" ||
            getLiveProperties?.rs_sync_status === "failed")
            ? () =>
                syncNango({
                  companyId,
                  payload: { provider: item.slug },
                })
            : undefined,
      };
    });

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="flex flex-col gap-4 w-full">
        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {transformIntegrationsData?.map((integration: any) => (
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

        <div className="px-4">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={(value: number) => setPage(value)}
          />
        </div>
      </div>
    </PageState>
  );
};

export default All;
