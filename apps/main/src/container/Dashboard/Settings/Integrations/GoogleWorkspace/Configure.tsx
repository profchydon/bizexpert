import EmptyTableInstance from "@/components/EmptyTableInstance";
import Autocomplete from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import React, { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormField from "@/components/Custom/FormField";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { configureGoogleWorkspaceSchema } from "./validation";
import TagsInput from "@/components/TagsInput";
import { I_Configuration } from "@/types/integrations";
import { useUpdateIntegrationStatusMutation } from "@/api/baseQueries/companiesApi/integrationsApi/updateIntegrationStatus";
import useKeyGenerator from "@/hooks/useKeyGenerator";

interface Props {
  code: string;
  isLoading: boolean;
  onFinish: (data: {
    domain: string;
    sync_frequency: string;
    excluded_emails: string[];
  }) => void;
  domain?: string;
  configuration?: I_Configuration;
  settings_instance?: boolean;
  statusState: "Active" | "Inactive";
  companyId: string;
  integration_id: string;
}

const Configure: React.FC<Props> = ({
  statusState,
  code,
  onFinish,
  isLoading,
  domain,
  configuration,
  settings_instance,
  companyId,
  integration_id,
}) => {
  const [status, setStatus] = useState(false);
  const { internalKey, generateKey } = useKeyGenerator();
  const isInitialMount = useRef(true);

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

  const form = useForm<z.infer<typeof configureGoogleWorkspaceSchema>>({
    resolver: zodResolver(configureGoogleWorkspaceSchema),
    defaultValues: {
      sync_frequency: initialSyncFrequency as any,
      domain: domain ?? "",
      excluded_emails: configuration?.excluded_emails ?? [],
    },
  });

  const onSubmit = (data: z.infer<typeof configureGoogleWorkspaceSchema>) => {
    const valueData = {
      domain: data?.domain as string,
      sync_frequency: data?.sync_frequency?.value as string,
      excluded_emails: data?.excluded_emails as string[],
    };
    onFinish(valueData);
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
        if (value) {
          displaySuccessMessage(
            "Integration Enabled",
            "Google Workspace has been enabled.",
          );
        } else {
          displayErrorMessage(
            "Integration disabled",
            "Google Workspace has been disabled",
          );
        }
      });
  };

  // Reset form when configuration changes (e.g., after reopening dialog with fresh data)
  useEffect(() => {
    // Only reset if we have configuration data (for existing integrations)
    if (configuration || domain) {
      const newSyncFrequency = configuration?.sync_frequency
        ? (syncOptions.find(
            (item) => item.value === configuration.sync_frequency,
          ) ?? null)
        : null;

      form.reset({
        sync_frequency: newSyncFrequency as any,
        domain: domain ?? "",
        excluded_emails: configuration?.excluded_emails ?? [],
      });

      if (newSyncFrequency) {
        generateKey();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration, domain]);

  return (
    <div>
      <div className="font-medium text-sm flex items-center gap-x-2">
        {!code && !settings_instance && <>Connect Your Google Account</>}
      </div>

      {!code && !settings_instance && (
        <EmptyTableInstance
          description="Connect your Google account to configure integration."
          title=" Connect Your Google Account."
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
                    onCheckedChange={(value) => {
                      setStatus(value);
                      handleIntegrationStatusSwitch(value);
                    }}
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
                  name="domain"
                  label="Google Workspace domain*"
                  render={({ field }) => (
                    <Input
                      placeholder="Enter the domain name of your Google Workspace"
                      disabled={settings_instance}
                      {...field}
                      data-testid="configure-input"
                    />
                  )}
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
                disabled={isLoading}
                data-testid="configure-button"
                // onClick={onFinish}
              >
                {!settings_instance ? "Finish" : "Update"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Configure;
