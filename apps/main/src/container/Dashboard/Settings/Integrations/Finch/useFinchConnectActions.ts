import { useRouter } from "next/navigation";
import {
  ActivationFinchIntegrationRequest,
  UpdateLiveIntegrationRequest,
} from "@/types/integrations";
import { useLazyFinchRedirectQuery } from "@/api/baseQueries/companiesApi/integrationsApi/finchRedirect";
import { useActivateFinchIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/activateFinchIntegration";
import { useUpdateLiveIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/updateLiveIntegration";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { shouldStartNewFinchConnect } from "@/utils/finchAuthorizationCode";
import {
  asRedirectUrl,
  openIntegrationRedirect,
} from "@/utils/auth/openIntegrationRedirect";
import { readStoredWorkspaceScope } from "@/utils/workspace/activeWorkspace";
import { finchConnectReturnPath } from "@/utils/auth/finchConnectReturnPath";
import {
  connectWorkspaceEntity,
  setIntegrationConnectCookies,
} from "@/utils/auth/integrationConnectCookies";

interface Input {
  companyId: string;
  code?: string;
  integration_id: string;
  slug: string;
  service_name: string;
  settings_instance: boolean;
  returnTo?: string;
  onClose: () => void;
  setTab: (tab: string) => void;
}

export function useFinchConnectActions({
  companyId,
  code,
  integration_id,
  slug,
  service_name,
  settings_instance,
  returnTo,
  onClose,
  setTab,
}: Input) {
  const router = useRouter();
  const [finchRedirect, redirectState] = useLazyFinchRedirectQuery();
  const [activateFinchIntegration, activateState] =
    useActivateFinchIntegrationMutation();
  const [updateLiveIntegration, updateState] =
    useUpdateLiveIntegrationMutation();

  const replaceConnectReturn = () => {
    if (typeof window === "undefined") {
      return;
    }
    router.replace(
      finchConnectReturnPath({
        returnTo,
        pathname: window.location.pathname,
        search: window.location.search,
      }),
    );
  };

  const handleContinue = async () => {
    if (!shouldStartNewFinchConnect(code)) {
      setTab("configure");
      return;
    }
    if (typeof document !== "undefined") {
      setIntegrationConnectCookies({
        returnTo,
        entity: connectWorkspaceEntity(
          window.location.search,
          readStoredWorkspaceScope(),
        ),
      });
    }
    await openIntegrationRedirect(async () => {
      const session = await finchRedirect({
        companyId,
        provider: slug,
        return_to: returnTo,
      }).unwrap();
      return asRedirectUrl(session.data?.connect_url);
    });
  };

  const handleFinish = async (data: {
    sync_frequency: string;
    excluded_emails: string[];
  }) => {
    if (!settings_instance) {
      const formatData = {
        companyId,
        payload: {
          code,
          company_id: companyId,
          integration_id,
          configuration: {
            sync_frequency: data?.sync_frequency as string,
            excluded_emails: data?.excluded_emails as string[],
          },
        },
      } as ActivationFinchIntegrationRequest;
      return await activateFinchIntegration(formatData)
        .unwrap()
        .then(() => {
          setTab("setup");
          onClose();
          replaceConnectReturn();
          displaySuccessMessage(
            "Integration successful",
            `${service_name} has been succesfully integrated, proceed to configure.`,
          );
        });
    }

    const formatData = {
      companyId,
      integration_id,
      payload: {
        configuration: {
          sync_frequency: data?.sync_frequency as string,
          excluded_emails: data?.excluded_emails as string[],
        },
      },
    } as UpdateLiveIntegrationRequest;

    return await updateLiveIntegration(formatData)
      .unwrap()
      .then(() => {
        onClose();
        replaceConnectReturn();
        displaySuccessMessage(
          "Configuration successful",
          "Configuration has been updated succesfully",
        );
      });
  };

  return {
    handleContinue,
    handleFinish,
    isFinchRedirectLoading: redirectState.isLoading || redirectState.isFetching,
    isActivateFinchLoading: activateState.isLoading || updateState.isLoading,
  };
}
