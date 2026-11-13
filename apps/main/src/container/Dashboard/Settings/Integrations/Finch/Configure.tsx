import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormField from "@/components/Custom/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TagsInput from "@/components/TagsInput";
import { I_Configuration } from "@/types/integrations";
import { setupFormSchema } from "./validation";
import Autocomplete from "@/components/ui/autocomplete";
import { useUpdateIntegrationStatusMutation } from "@/api/baseQueries/companiesApi/integrationsApi/updateIntegrationStatus";
import useKeyGenerator from "@/hooks/useKeyGenerator";
import DisconnectIntegrationModal from "@/components/DisconnectIntegrationModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  code: string;
  isLoading: boolean;
  onFinish: (data: {
    sync_frequency: string;
    excluded_emails: string[];
  }) => void | Promise<void>;
  configuration?: I_Configuration;
  settings_instance?: boolean;
  statusState: "Active" | "Inactive";
  companyId: string;
  integration_id: string;
  service_name: string;
  onClose: () => void;
}

const Configure: React.FC<Props> = ({
  statusState,
  code,
  onFinish,
  isLoading,
  configuration,
  settings_instance = false,
  companyId,
  integration_id,
  service_name,
  onClose,
}) => {
  const [status, setStatus] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
  const { internalKey, generateKey } = useKeyGenerator();

  useEffect(() => {
    if (statusState === "Active") {
      return setStatus(true);
    }
    if (statusState === "Inactive") {
      return setStatus(false);
    }
  }, [statusState]);

  const [updateIntegrationStatus, { isLoading: isUpdatingIntegrationStatus }] =
    useUpdateIntegrationStatusMutation();

  const syncOptions = [
    { label: "Daily (Every 24hrs)", value: "Daily" },
    { label: "Weekly (Every 7days)", value: "Weekly" },
    { label: "Bi-weekly (Every 14days)", value: "Bi-weekly" },
    { label: "Monthly (Every 30days)", value: "Monthly" },
  ];

  // Compute initial sync_frequency option from configuration
  const initialSyncFrequency = configuration?.sync_frequency
    ? (syncOptions.find(
        (item) => item.value === configuration.sync_frequency,
      ) ?? null)
    : null;

  const form = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      sync_frequency: initialSyncFrequency as any,
      excluded_emails: configuration?.excluded_emails ?? [],
    },
  });

  const onSubmit = async (data: z.infer<typeof setupFormSchema>) => {
    const valueData = {
      sync_frequency: data?.sync_frequency?.value as string,
      excluded_emails: data?.excluded_emails as string[],
    };
    await onFinish(valueData);
  };

  const handleIntegrationStatusSwitch = async (value: boolean) => {
    const getStatus = !value ? "Inactive" : "Active";
    await updateIntegrationStatus({
      companyId,
      integration_id,
      status: getStatus?.toLowerCase(),
    })
      .unwrap()
      .then((res) => {
        setStatus(value);
        if (value) {
          displaySuccessMessage(
            "Integration Enabled",
            `${service_name} has been enabled.`,
          );
        } else {
          displaySuccessMessage(
            "Integration Disconnected",
            `${service_name} has been disconnected successfully.`,
          );
        }
      });
  };

  const handleRequestStatusChange = (value: boolean) => {
    setPendingStatus(value);
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (pendingStatus === null) {
      return;
    }
    setIsConfirmOpen(false);
    await handleIntegrationStatusSwitch(pendingStatus);
    setPendingStatus(null);
    onClose();
  };

  const handleCancelStatusChange = () => {
    setIsConfirmOpen(false);
    setPendingStatus(null);
  };

  const handleConfirmOpenChange = (open: boolean) => {
    if (!open) {
      handleCancelStatusChange();
      return;
    }
    setIsConfirmOpen(true);
  };

  // Reset form when configuration changes (e.g., after reopening dialog with fresh data)
  useEffect(() => {
    // Only reset if we have configuration data (for existing integrations)
    if (configuration) {
      const newSyncFrequency = configuration?.sync_frequency
        ? (syncOptions.find(
            (item) => item.value === configuration.sync_frequency,
          ) ?? null)
        : null;

      form.reset({
        sync_frequency: newSyncFrequency as any,
        excluded_emails: configuration?.excluded_emails ?? [],
      });

      if (newSyncFrequency) {
        generateKey();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration]);

  return (
    <div>
      <div className="font-medium text-sm flex items-center gap-x-2">
        {!code && !settings_instance && (
          <>Connect Your {service_name || ""} ID</>
        )}
      </div>

      {!code && !settings_instance && (
        <EmptyTableInstance
          description="Setup integration to configure"
          title="Setup integration to continue."
        />
      )}
      {(code || settings_instance) && (
        <div className="space-y-6">
          <Form {...form}>
            {/* @ts-ignore */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="my-2">
              {!code && (
                <div className="flex items-center gap-x-2">
                  <Label htmlFor="status">Integration status</Label>
                  <Switch
                    id="status"
                    checked={status}
                    disabled={isUpdatingIntegrationStatus}
                    onCheckedChange={handleRequestStatusChange}
                  />
                </div>
              )}

              <div className="flex flex-col gap-y-2 my-6">
                <FormField
                  control={form.control}
                  name="sync_frequency"
                  label="Sync Frequency*"
                  render={({ field: { onChange, value } }) =>
                    syncOptions && (
                      <Autocomplete
                        options={syncOptions}
                        setSelectedOption={(selected) => {
                          onChange(selected);
                        }}
                        selectedOption={value}
                        placeholder="Enter Sync Frequency"
                        portalInBody={false}
                        data-testid="configure-autocomplete"
                        isClearable={true}
                        externalKey={internalKey}
                      />
                    )
                  }
                />
              </div>

              <div className="flex flex-col gap-y-2 my-6">
                <FormField
                  control={form.control}
                  name="excluded_emails"
                  label="Email Exclusions (Optional)"
                  render={({ field: { onChange, value, ...restField } }) => (
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
                        Specify any email addresses you would like to exclude
                        from synchronization. Type an email address and press
                        Tab or Enter to add it.
                      </div>
                    </div>
                  )}
                />
              </div>

              <Button
                variant="primary"
                className="w-full mt-6"
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                data-testid="configure-button"
              >
                {!settings_instance ? "Finish" : "Update"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* Disconnect Modal */}
      {pendingStatus === false && (
        <DisconnectIntegrationModal
          isOpen={isConfirmOpen}
          onClose={handleCancelStatusChange}
          onConfirm={handleConfirmStatusChange}
          integrationName={service_name}
          isLoading={isUpdatingIntegrationStatus}
          className="z-[1105]"
        />
      )}

      {/* Enable Modal */}
      {pendingStatus === true && (
        <AlertDialog
          open={isConfirmOpen}
          onOpenChange={handleConfirmOpenChange}
        >
          <AlertDialogContent className="z-[1105]">
            <AlertDialogHeader>
              <AlertDialogTitle>Enable integration?</AlertDialogTitle>
              <AlertDialogDescription>
                This will enable {service_name} integration for your
                organization.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelStatusChange}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmStatusChange}
                disabled={isUpdatingIntegrationStatus}
              >
                Enable
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Configure;
