import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import displayErrorMessage from "@/utils/displayErrorMessage";
import {
  useActivateNangoIntegrationMutation,
  useDisconnectNangoIntegrationMutation,
  useNangoConnectSessionMutation,
  useSyncNangoIntegrationMutation,
} from "@/api/baseQueries/companiesApi/integrationsApi/nangoIntegrations";
import { I_RsSyncStatus } from "@/types/integrations";
import { liveIntegrationSyncCopy } from "../liveIntegrationSyncCopy";
import {
  knowledgeComingSoonCopy,
  nangoRoutingFieldsFor,
} from "../nangoRoutingFields";
import { openNangoConnectUi } from "./openNangoConnectUi";
import NangoRoutingFieldsForm from "./NangoRoutingFieldsForm";
import Autocomplete from "@/components/ui/autocomplete";
import {
  INTEGRATION_SYNC_FREQUENCY_OPTIONS,
  type IntegrationSyncFrequencyOption,
  supportsTicketIngestSync,
  syncFrequencyOptionFor,
  toSyncFrequencyOption,
} from "../integrationSyncFrequency";
import FinchSetup from "../Finch/Setup";
import { parseIntegrationCategory } from "../integrationsSearchParams";
import { useSearchParams } from "next/navigation";
import { buildIntegrationsSettingsPath } from "../integrationsSearchParams";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  isLive?: boolean;
  status: "Active" | "Inactive";
  service_name: string;
  service_description: string;
  slug: string;
  icon: string;
  rsSyncStatus?: I_RsSyncStatus | null;
  rsSyncError?: string | null;
  nangoConnectionId?: string | null;
  initialRouting?: {
    project_key?: string;
    board_id?: string;
    sync_frequency?: string;
  };
  lastSyncAt?: string | null;
}

const NangoConnect: React.FC<Props> = ({
  isOpen,
  onClose,
  companyId,
  isLive = false,
  status,
  service_name,
  service_description,
  slug,
  icon,
  rsSyncStatus,
  rsSyncError,
  nangoConnectionId,
  initialRouting,
  lastSyncAt,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(isLive ? "configure" : "setup");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isNangoUiOpen, setIsNangoUiOpen] = useState(false);
  const [routing, setRouting] = useState<Record<string, string>>({});
  const [syncFrequency, setSyncFrequency] =
    useState<IntegrationSyncFrequencyOption>(
      syncFrequencyOptionFor(initialRouting?.sync_frequency),
    );
  const fields = nangoRoutingFieldsFor(slug);
  const showTicketSyncFrequency = supportsTicketIngestSync(slug);
  const effectiveConnectionId = connectionId ?? nangoConnectionId ?? null;
  const comingSoon = knowledgeComingSoonCopy(slug);

  useEffect(() => {
    if (!initialRouting) {
      return;
    }

    setRouting({
      project_key: initialRouting.project_key ?? "",
      board_id: initialRouting.board_id ?? "",
    });
    setSyncFrequency(syncFrequencyOptionFor(initialRouting.sync_frequency));
  }, [initialRouting]);

  const [createSession, { isLoading: sessionLoading }] =
    useNangoConnectSessionMutation();
  const [activate, { isLoading: activateLoading }] =
    useActivateNangoIntegrationMutation();
  const [disconnect, { isLoading: disconnectLoading }] =
    useDisconnectNangoIntegrationMutation();
  const [sync, { isLoading: syncLoading }] = useSyncNangoIntegrationMutation();

  const closeAndStay = () => {
    const category = parseIntegrationCategory(searchParams.get("category"));
    const view =
      searchParams.get("integrationView") === "live" ? "live" : "all";
    router.replace(buildIntegrationsSettingsPath({ category, view }));
    onClose();
  };

  const handleConnect = async () => {
    try {
      const session = await createSession({
        companyId,
        provider: slug,
      }).unwrap();
      const token = session?.data?.token;
      if (!token) {
        throw new Error("Missing Nango session token");
      }
      setIsNangoUiOpen(true);
      let nextConnectionId: string;
      try {
        nextConnectionId = await openNangoConnectUi(token);
      } finally {
        setIsNangoUiOpen(false);
      }
      setConnectionId(nextConnectionId);
      if (fields.length === 0) {
        await activate({
          companyId,
          payload: {
            provider: slug,
            connection_id: nextConnectionId,
            sync_frequency: showTicketSyncFrequency
              ? syncFrequency.value
              : undefined,
          },
        }).unwrap();
        displaySuccessMessage("Integration connected");
        closeAndStay();
        return;
      }
      setTab("configure");
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || error?.message || "Could not connect",
      );
    }
  };

  const handleActivate = async () => {
    if (!effectiveConnectionId && !isLive) {
      displayErrorMessage("Connect the account first");
      return;
    }
    try {
      await activate({
        companyId,
        payload: {
          provider: slug,
          connection_id: effectiveConnectionId || "",
          project_key: routing.project_key,
          board_id: routing.board_id,
          sync_frequency: showTicketSyncFrequency
            ? syncFrequency.value
            : undefined,
        },
      }).unwrap();
      displaySuccessMessage(
        isLive ? "Integration settings saved" : "Integration connected",
      );
      closeAndStay();
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || error?.message || "Could not finish setup",
      );
    }
  };

  const handleRetry = async () => {
    try {
      await sync({ companyId, payload: { provider: slug } }).unwrap();
      displaySuccessMessage("Setup retry started");
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || error?.message || "Retry failed",
      );
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect({ companyId, payload: { provider: slug } }).unwrap();
      displaySuccessMessage("Integration disconnected");
      closeAndStay();
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || error?.message || "Could not disconnect",
      );
    }
  };

  const pending = rsSyncStatus === "pending" || rsSyncStatus === "failed";
  const syncCopy = liveIntegrationSyncCopy(rsSyncStatus, rsSyncError);

  return (
    <Dialog
      open={isOpen}
      modal={!isNangoUiOpen}
      onOpenChange={(open) => {
        if (!open && !isNangoUiOpen) {
          closeAndStay();
        }
      }}
      data-testid="nangoconnect-dialog"
    >
      <DialogContent
        overlayClassName={cn(isNangoUiOpen && "pointer-events-none opacity-0")}
        className={cn(
          "md:min-w-[400px] max-h-[calc(100%-20px)] w-[calc(100%-10px)] flex flex-col overflow-y-auto",
          isNangoUiOpen && "pointer-events-none opacity-0",
        )}
      >
        <DialogHeader className="text-left">
          <Image
            src={icon || ""}
            alt={`${service_name}-icon`}
            className="max-w-[1.9rem] max-h-[1.9rem]"
          />
          <DialogTitle className="text-base font-semibold text-gray-900">
            {service_name}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {service_description}
          </DialogDescription>
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
            <FinchSetup
              isConnected={isLive || Boolean(connectionId)}
              onContinue={handleConnect}
              isLoading={sessionLoading || activateLoading}
              onProceedToConfigure={() => setTab("configure")}
              service_name={service_name}
            />
          </TabsContent>

          <TabsContent value="configure" className="flex flex-col gap-6">
            {comingSoon && isLive && (
              <p className="text-sm text-gray-600">{comingSoon}</p>
            )}
            {pending && (
              <div
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm",
                  syncCopy.isFailed
                    ? "bg-red-50 text-red-800"
                    : "bg-amber-50 text-amber-800",
                )}
              >
                <span>{syncCopy.banner}</span>
                <Button
                  variant="outline"
                  className="h-8"
                  onClick={handleRetry}
                  disabled={syncLoading}
                  data-testid="nangoconnect-button"
                >
                  Retry
                </Button>
              </div>
            )}
            {showTicketSyncFrequency && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-900">
                  Ticket sync frequency
                </label>
                <Autocomplete
                  selectedOption={syncFrequency}
                  setSelectedOption={(option) => {
                    const next = toSyncFrequencyOption(option);
                    if (next) {
                      setSyncFrequency(next);
                    }
                  }}
                  options={[...INTEGRATION_SYNC_FREQUENCY_OPTIONS]}
                  placeholder="Select sync frequency"
                  portalInBody={false}
                  data-testid="nangoconnect-autocomplete"
                />
                {lastSyncAt ? (
                  <p className="text-xs text-gray-500">
                    Last synced {new Date(lastSyncAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            )}
            <NangoRoutingFieldsForm
              slug={slug}
              companyId={companyId}
              connectionId={effectiveConnectionId}
              routing={routing}
              onRoutingChange={setRouting}
            />
            <div className="flex justify-end gap-2">
              {isLive && (
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  disabled={disconnectLoading}
                  data-testid="nangoconnect-button-2"
                >
                  Disconnect
                </Button>
              )}
              <Button
                onClick={handleActivate}
                disabled={activateLoading}
                data-testid="nangoconnect-button-3"
              >
                {isLive ? "Save settings" : "Finish setup"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NangoConnect;
