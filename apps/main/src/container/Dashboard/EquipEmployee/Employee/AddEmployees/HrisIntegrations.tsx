"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import PageState from "@/components/PageState";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetIntegrationsQuery } from "@/api/baseQueries/companiesApi/integrationsApi/getIntegrations";
import { useLazyVerifyFinchCodeQuery } from "@/api/baseQueries/companiesApi/integrationsApi/verifyFinchCode";
import {
  exchangeFinchAuthorizationCodeOnce,
  shouldExchangeFinchAuthorizationCode,
} from "@/utils/finchAuthorizationCode";
import {
  I_Configuration,
  I_Integration,
  I_IntegrationType,
  I_LiveIntegrations,
  UpdateLiveIntegrationRequest,
} from "@/types/integrations";
import { slug as integrationIcons } from "@/container/Dashboard/Settings/Integrations/integrationImages";
import Finch from "@/container/Dashboard/Settings/Integrations/Finch";
import { Form } from "@/components/ui/form";
import FormField from "@/components/Custom/FormField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Autocomplete from "@/components/ui/autocomplete";
import TagsInput from "@/components/TagsInput";
import { useUpdateLiveIntegrationMutation } from "@/api/baseQueries/companiesApi/integrationsApi/updateLiveIntegration";
import { useUpdateIntegrationStatusMutation } from "@/api/baseQueries/companiesApi/integrationsApi/updateIntegrationStatus";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import displayErrorMessage from "@/utils/displayErrorMessage";
import useKeyGenerator from "@/hooks/useKeyGenerator";
import DisconnectIntegrationModal from "@/components/DisconnectIntegrationModal";
import { isFinchIntegration } from "@/container/Dashboard/Settings/Integrations/liveIntegrationKey";
import { resolveHrisFinchOpenState } from "./hris/resolveHrisFinchOpenState";
import type { HrisFinchManageState } from "./hris/hrisFinchManageState";
import {
  buildEmployeesPath,
  buildHrisTabQueryWithoutIntegrationParams,
  shouldReplaceEmployeesPath,
} from "./hris/hrisIntegrationSearchParams";
import { HrisConnectMoreButton } from "./hris/HrisConnectMoreButton";
import { HrisConnectedFooter } from "./hris/HrisConnectedFooter";
import { HrisConnectedList } from "./hris/HrisConnectedList";
import { formatLastSyncAt, formatNextSyncIn } from "./hris/hrisSyncSchedule";

const HRIS_EXCLUDED_SLUGS = new Set([
  "google-workspace",
  "microsoft-entra-id",
  "microsoft-intune",
  "apple-business-manager",
  "slack",
]);

const configFormSchema = z.object({
  sync_frequency: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Sync frequency is required",
    }),
  excluded_emails: z.array(z.string()).optional(),
});

interface Props {
  onClose?: () => void;
  onOpen?: () => void;
  finchManageOpen?: boolean;
  onOpenFinchManage?: (state: HrisFinchManageState) => void;
}

const HrisIntegrations: React.FC<Props> = ({
  onClose,
  onOpen,
  finchManageOpen = false,
  onOpenFinchManage,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [openIntegration, setOpenIntegration] = useState<string | null>(null);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(true);
  const { internalKey, generateKey } = useKeyGenerator();
  const prevFinchManageOpenRef = useRef(finchManageOpen);
  const openedFinchIntegrationRef = useRef<string | null>(null);

  const code = searchParams.get("code") as string;
  const service = searchParams.get("service") as string;
  const integrationParam = searchParams.get("integration") as string;

  const companyId = useWorkspaceCompanyId();

  const {
    data: getIntegrations,
    isLoading: isLoading_getInt,
    isFetching: isFetching_getInit,
    isError: getInit_error,
  } = useGetIntegrationsQuery(
    {
      companyId: companyId!,
      params: { page: 1 },
    },
    { skip: !companyId },
  );

  const [updateLiveIntegration, { isLoading: isUpdating }] =
    useUpdateLiveIntegrationMutation();

  const [updateIntegrationStatus, { isLoading: isDisconnecting }] =
    useUpdateIntegrationStatusMutation();

  const [
    verifyFinchCode,
    {
      data: verifyData,
      isLoading: isLoading_verifyFinch,
      isFetching: isFetching_verifyFinch,
      isError: verifyFinch_error,
    },
  ] = useLazyVerifyFinchCodeQuery();

  useEffect(() => {
    if (
      !companyId ||
      !shouldExchangeFinchAuthorizationCode({ code, service, companyId })
    ) {
      return;
    }

    let cancelled = false;

    exchangeFinchAuthorizationCodeOnce(code, () =>
      verifyFinchCode({ companyId, code }).unwrap(),
    )
      .then((payload) => {
        if (cancelled || !payload?.success || !payload?.data) {
          return;
        }

        const {
          integration,
          integration_id,
          code: exchangedCode,
        } = payload.data;
        const normalizedIntegration = String(integration || "")
          .trim()
          .toLowerCase();
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", "hris");
        if (normalizedIntegration) {
          params.set("integration", normalizedIntegration);
        }
        params.set("integration_id", integration_id);
        params.set("code", exchangedCode);
        params.delete("service");
        const nextQuery = params.toString();
        if (shouldReplaceEmployeesPath(searchParams, nextQuery)) {
          router.replace(buildEmployeesPath(nextQuery));
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [code, service, companyId, verifyFinchCode, router, searchParams]);

  useEffect(() => {
    if (!integrationParam) {
      return;
    }

    const normalizedIntegration = integrationParam.trim().toLowerCase();
    if (normalizedIntegration !== "finch") {
      setOpenIntegration(normalizedIntegration);
      return;
    }

    const providerFromVerification = String(verifyData?.data?.integration || "")
      .trim()
      .toLowerCase();

    if (providerFromVerification) {
      setOpenIntegration(providerFromVerification);
      return;
    }

    setOpenIntegration("finch");
  }, [integrationParam, verifyData?.data?.integration]);

  const integrationsData = getIntegrations?.data?.integrations
    ?.data as I_Integration[];

  const liveIntegrations = getIntegrations?.data
    ?.live_integrations as I_LiveIntegrations[];

  const liveHrisIntegrations = useMemo(() => {
    const list = liveIntegrations ?? [];
    return list.filter((item) => {
      if (isFinchIntegration(item)) {
        return true;
      }
      return !HRIS_EXCLUDED_SLUGS.has(item?.integration?.slug);
    });
  }, [liveIntegrations]);

  const singleIntegration =
    liveHrisIntegrations?.length === 1 ? liveHrisIntegrations[0] : null;

  const syncOptions = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Bi-weekly", value: "Bi-weekly" },
    { label: "Monthly", value: "Monthly" },
  ];

  const initialSyncFrequency = singleIntegration?.configuration?.sync_frequency
    ? (syncOptions.find(
        (item) => item.value === singleIntegration.configuration.sync_frequency,
      ) ?? null)
    : null;

  const form = useForm<z.infer<typeof configFormSchema>>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      sync_frequency: initialSyncFrequency as any,
      excluded_emails: singleIntegration?.configuration?.excluded_emails ?? [],
    },
  });

  useEffect(() => {
    if (singleIntegration) {
      const newSyncFrequency = singleIntegration?.configuration?.sync_frequency
        ? (syncOptions.find(
            (item) =>
              item.value === singleIntegration.configuration.sync_frequency,
          ) ?? null)
        : null;

      form.reset({
        sync_frequency: newSyncFrequency as any,
        excluded_emails:
          singleIntegration?.configuration?.excluded_emails ?? [],
      });

      if (newSyncFrequency) {
        generateKey();
      }

      // Ensure drawer is open when single integration is available
      setIsConfigurationOpen(true);
    }
  }, [singleIntegration?.id, singleIntegration?.configuration]);

  const isLoading =
    isLoading_getInt ||
    isFetching_getInit ||
    isLoading_verifyFinch ||
    isFetching_verifyFinch;
  const isError = getInit_error || verifyFinch_error;

  const filteredIntegrations = useMemo(() => {
    if ((liveHrisIntegrations ?? []).length > 0) {
      return [];
    }
    const list = integrationsData ?? [];
    const liveIds = new Set(
      (liveHrisIntegrations ?? []).map(
        (item) => item?.integration?.id as string,
      ),
    );

    const hrisList = list.filter((item: any) => {
      if (item?.service) {
        return item?.service === "finch";
      }
      return !HRIS_EXCLUDED_SLUGS.has(item?.slug);
    });

    const disconnectedList = hrisList.filter(
      (item: any) => !liveIds.has(item?.id as string),
    );

    if (!searchValue.trim()) {
      return disconnectedList;
    }

    const lowered = searchValue.toLowerCase();
    return disconnectedList.filter((item: any) =>
      item?.name?.toLowerCase()?.includes(lowered),
    );
  }, [integrationsData, liveHrisIntegrations, searchValue]);

  const replaceEmployeesSearchParams = (nextQuery: string) => {
    if (!shouldReplaceEmployeesPath(searchParams, nextQuery)) {
      return;
    }

    router.replace(buildEmployeesPath(nextQuery));
  };

  const clearIntegrationParams = () => {
    const nextQuery = buildHrisTabQueryWithoutIntegrationParams(
      new URLSearchParams(searchParams.toString()),
    );

    if (!nextQuery) {
      return;
    }

    replaceEmployeesSearchParams(nextQuery);
  };

  useEffect(() => {
    if (!openIntegration || !onOpenFinchManage || !companyId) {
      return;
    }

    if (openedFinchIntegrationRef.current === openIntegration) {
      return;
    }

    const finchState = resolveHrisFinchOpenState({
      openIntegration,
      companyId,
      liveHrisIntegrations,
      integrationsData,
      code,
      integrationParam,
    });

    if (!finchState) {
      return;
    }

    openedFinchIntegrationRef.current = openIntegration;
    onOpenFinchManage(finchState);
  }, [
    code,
    companyId,
    integrationParam,
    integrationsData,
    liveHrisIntegrations,
    onOpenFinchManage,
    openIntegration,
  ]);

  useEffect(() => {
    const wasFinchManageOpen = prevFinchManageOpenRef.current;
    prevFinchManageOpenRef.current = finchManageOpen;

    if (!wasFinchManageOpen || finchManageOpen) {
      return;
    }

    openedFinchIntegrationRef.current = null;
    setOpenIntegration(null);
    clearIntegrationParams();
  }, [finchManageOpen]);

  const formatSyncTime = formatLastSyncAt;
  const showSingleConfig = Boolean(singleIntegration && isConfigurationOpen);
  const showConnectedList =
    (liveHrisIntegrations?.length ?? 0) > 0 && !showSingleConfig;

  const handleSaveConfiguration = async (
    data: z.infer<typeof configFormSchema>,
  ) => {
    if (!singleIntegration || !companyId) return;

    const payload = {
      configuration: {
        sync_frequency: data.sync_frequency?.value as string,
        excluded_emails: data.excluded_emails ?? [],
      },
    };

    const formatData = {
      companyId,
      integration_id: singleIntegration.id,
      payload,
    } as UpdateLiveIntegrationRequest;

    try {
      await updateLiveIntegration(formatData).unwrap();
      displaySuccessMessage(
        "Configuration updated",
        "Sync settings have been updated successfully",
      );
    } catch (error: any) {
      console.error("Failed to update configuration:", error);
      displayErrorMessage(
        "Update failed",
        error?.data?.message ||
          "Failed to update configuration. Please try again.",
      );
    }
  };

  const handleDisconnect = async () => {
    if (!singleIntegration || !companyId) return;

    try {
      await updateIntegrationStatus({
        companyId,
        integration_id: singleIntegration.id,
        status: "inactive",
      }).unwrap();

      setIsDisconnectDialogOpen(false);
      displaySuccessMessage(
        "Integration disconnected",
        singleIntegration.integration.name +
          " has been disconnected successfully.",
      );
    } catch (error: any) {
      console.error("Failed to disconnect integration:", error);
      displayErrorMessage(
        "Disconnection failed",
        error?.data?.message ||
          "Failed to disconnect integration. Please try again.",
      );
    }
  };

  const handleDisconnectClick = () => {
    setIsDisconnectDialogOpen(true);
  };

  const handleCancelDisconnect = () => {
    setIsDisconnectDialogOpen(false);
  };

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        {liveHrisIntegrations?.length === 0 && (
          <div className="px-6 pb-6 pt-6">
            <SearchWithIcon
              placeholder="Search for integration"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full rounded-md border border-gray-200"
            />
          </div>
        )}

        {showSingleConfig ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pt-6">
              <div className="flex items-center justify-end">
                <HrisConnectMoreButton />
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 font-medium text-xs">
                  Last sync •{" "}
                  {formatSyncTime(liveHrisIntegrations[0]?.last_sync_at)}
                </span>
              </div>

              <div className="space-y-6">
                {/* Integration Header */}
                <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
                  <CardContent className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      {(() => {
                        const icon = integrationIcons.find(
                          (iconItem) =>
                            iconItem.slug ===
                            singleIntegration?.integration?.slug,
                        )?.icon;

                        return icon ? (
                          <Image
                            src={icon}
                            alt={singleIntegration?.integration?.name || ""}
                            width={56}
                            height={56}
                            className="h-14 w-14 flex-shrink-0"
                          />
                        ) : null;
                      })()}

                      <div className="space-y-1 flex-shrink-0">
                        <h3 className="text-lg font-semibold text-gray-900 leading-6">
                          {singleIntegration?.integration?.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-5">
                          Next sync in:{" "}
                          {formatNextSyncIn(
                            singleIntegration?.last_sync_at,
                            singleIntegration?.configuration?.sync_frequency,
                          )}
                        </p>
                      </div>

                      {singleIntegration?.domain && (
                        <div className="space-y-1 flex-1">
                          <p className="text-base font-medium text-gray-900 leading-6">
                            {singleIntegration?.domain}
                          </p>
                          <p className="text-sm text-gray-600 leading-5">
                            Found in your {singleIntegration?.integration?.name}{" "}
                            account URL
                          </p>
                        </div>
                      )}

                      <Badge
                        variant="success_border"
                        className="text-xs font-medium flex-shrink-0 flex items-center gap-1.5 ml-auto"
                      >
                        <span className="h-2 w-2 rounded-full bg-success-500"></span>
                        <span className="text-medium text-success-700">
                          Connected
                        </span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Sync Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary-700">
                    Sync Settings
                  </h3>

                  <Form {...form}>
                    <form
                      id="hris-connected-config"
                      onSubmit={form.handleSubmit(handleSaveConfiguration)}
                      className="space-y-4"
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="sync_frequency"
                            label={
                              <div className="flex items-center gap-1 mb-1.5">
                                <span className="text-gray-700 font-medium">
                                  Sync Frequency
                                </span>
                                <span className="text-primary-500">*</span>
                              </div>
                            }
                            render={({ field: { onChange, value } }) => (
                              <Autocomplete
                                options={syncOptions}
                                setSelectedOption={(selected) => {
                                  onChange(selected);
                                }}
                                selectedOption={value}
                                placeholder="Enter Sync Frequency"
                                portalInBody={false}
                                isClearable={false}
                                externalKey={internalKey}
                                data-testid="hrisintegrations-autocomplete"
                              />
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name="excluded_emails"
                            label={
                              <div className="flex items-center gap-1 mb-1.5">
                                <span className="text-gray-700 font-medium">
                                  Email Exclusions (Optional)
                                </span>
                              </div>
                            }
                            render={({ field: { onChange, value } }) => (
                              <div className="flex flex-col gap-y-3 mb-3">
                                <div>
                                  <TagsInput
                                    setValues={(newEmails) => {
                                      onChange(newEmails);
                                    }}
                                    values={value || []}
                                    placeholder="Exclude from sync"
                                  />
                                </div>
                                <div className="text-gray-600 text-sm">
                                  Specify any email addresses you would like to
                                  exclude from synchronization. Type an email
                                  address and press Tab or Enter to add it.
                                </div>
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
            <HrisConnectedFooter
              formId="hris-connected-config"
              isDisconnecting={isDisconnecting}
              isUpdating={isUpdating}
              onDisconnect={handleDisconnectClick}
            />
          </div>
        ) : showConnectedList ? (
          <HrisConnectedList
            integrations={liveHrisIntegrations}
            onManage={(slug) => setOpenIntegration(slug)}
          />
        ) : null}

        <div className="grid grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
          {filteredIntegrations?.map((item: any) => {
            const matchedIcon =
              integrationIcons.find((iconItem) => iconItem.slug === item.slug)
                ?.icon || "";

            const liveIntegration = liveIntegrations?.find(
              (liveItem) => liveItem?.integration?.id === item?.id,
            ) as I_LiveIntegrations | undefined;

            const isConnected = Boolean(liveIntegration);
            const statusLabel =
              liveIntegration?.status === "Active"
                ? "Connected"
                : liveIntegration?.status === "Inactive"
                  ? "Disconnected"
                  : isConnected
                    ? "Connected"
                    : "Disconnected";

            let component:
              | ((isOpen: boolean, onClose: () => void) => ReactElement)
              | null = null;

            if (item?.service === "finch") {
              component = (isOpen, onClose) => (
                <Finch
                  isOpen={isOpen}
                  onClose={() => {
                    onClose();
                    clearIntegrationParams();
                  }}
                  code={code}
                  integration={integrationParam as I_IntegrationType}
                  isLive={isConnected}
                  status={liveIntegration?.status ?? "Inactive"}
                  integration_id={
                    isConnected ? (liveIntegration?.id as string) : item?.id
                  }
                  companyId={companyId!}
                  domain={liveIntegration?.domain as string}
                  configuration={
                    liveIntegration?.configuration as I_Configuration
                  }
                  settings_instance={isConnected}
                  service_name={item?.name}
                  service_description={item?.description}
                  slug={item?.slug}
                  icon={matchedIcon}
                  returnTo="employees"
                />
              );
            }

            const isOpen = openIntegration === item?.slug;

            return (
              <React.Fragment key={item?.id}>
                {isConnected ? (
                  <Card
                    className={cn(
                      "flex h-full min-h-[168px] flex-col border border-gray-200 bg-white shadow-none",
                      !component && "opacity-40 pointer-events-none",
                    )}
                  >
                    <CardContent className="flex flex-1 flex-col gap-4 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white p-1">
                            {matchedIcon ? (
                              <div className="relative h-full w-full">
                                <Image
                                  src={matchedIcon}
                                  alt={item?.name}
                                  fill
                                  sizes="32px"
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="h-full w-full rounded-lg bg-gray-100" />
                            )}
                          </div>
                          <div className="flex flex-col gap-0">
                            <div className="text-sm font-semibold text-gray-900">
                              {item?.name}
                            </div>
                          </div>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          {statusLabel}
                        </Badge>
                      </div>
                    </CardContent>

                    <CardFooter className="mt-auto flex items-center justify-between border-t border-gray-200 px-4 py-3">
                      <Button
                        className="w-full text-sm"
                        variant="outline"
                        onClick={() => setOpenIntegration(item?.slug)}
                        data-testid="hrisintegrations-button"
                      >
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <div
                    className={cn(
                      "border rounded-lg p-3 cursor-pointer transition-colors xl:w-[199px] h-[124px] border-gray-200 hover:border-gray-300 text-left",
                      !component && "opacity-40 pointer-events-none",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center min-w-0">
                        {matchedIcon ? (
                          <Image
                            src={matchedIcon}
                            width={40}
                            height={40}
                            alt={item?.name}
                            className="mr-2 rounded-lg p-0.5 flex-shrink-0"
                          />
                        ) : (
                          <div className="mr-2 h-10 w-10 rounded-lg bg-gray-100" />
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm truncate block max-w-full">
                            {item?.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-[1px]",
                              !isConnected
                                ? "border-gray-300"
                                : "border-success-300 bg-success-50 text-success-700",
                            )}
                          >
                            {!isConnected ? "Disconnected" : "Connected"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full flex-1 text-xs border-[1px] border-gray-300 cursor-pointer"
                        onClick={() => setOpenIntegration(item?.slug)}
                        data-testid="hrisintegrations-button-2"
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                )}

                {isOpen &&
                  component &&
                  !onOpenFinchManage &&
                  component(isOpen, () => setOpenIntegration(null))}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Disconnect Confirmation Dialog */}
      <DisconnectIntegrationModal
        isOpen={isDisconnectDialogOpen}
        onClose={handleCancelDisconnect}
        onConfirm={handleDisconnect}
        integrationName={singleIntegration?.integration?.name || ""}
        isLoading={isDisconnecting}
        elevateOverDrawer
      />
    </PageState>
  );
};

export default HrisIntegrations;
