import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import PageState from "@/components/PageState";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useGetAgentConfigQuery } from "@/api/baseQueries/companiesApi/settingsApi/agentConfigApi/getAgentConfig";
import { useSetAgentConfigMutation } from "@/api/baseQueries/companiesApi/settingsApi/agentConfigApi/setAgentConfig";
import { useResetAgentConfigMutation } from "@/api/baseQueries/companiesApi/settingsApi/agentConfigApi/resetAgentConfig";
import {
  DEFAULT_SYNC_MINUTES as DEFAULT_MINUTES,
  MAX_SYNC_MINUTES as MAX_MINUTES,
  MIN_SYNC_MINUTES as MIN_MINUTES,
  isValidSyncMinutes,
  minutesToSeconds,
  secondsToMinutes,
} from "./agentConfig.logic";

type AgentConfigFormValues = {
  syncIntervalMinutes: number;
};

const AgentConfig = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const {
    data: agentConfig,
    isLoading: isLoading_getAgentConfig,
    isFetching: isFetching_getAgentConfig,
    isError: getAgentConfig_error,
    refetch,
  } = useGetAgentConfigQuery(
    { companyId: company?.id || "" },
    { skip: !company },
  );

  const [setAgentConfig, { isLoading: isSaving }] = useSetAgentConfigMutation();
  const [resetAgentConfig, { isLoading: isResetting }] =
    useResetAgentConfigMutation();

  const form = useForm<AgentConfigFormValues>({
    defaultValues: { syncIntervalMinutes: DEFAULT_MINUTES },
  });

  const { control, handleSubmit, reset, watch } = form;
  const minutes = Number(watch("syncIntervalMinutes"));

  useEffect(() => {
    const seconds = agentConfig?.data?.sync_interval_seconds;
    if (seconds) {
      reset({ syncIntervalMinutes: secondsToMinutes(seconds) });
    }
  }, [agentConfig, reset]);

  const isValid = isValidSyncMinutes(minutes);

  const onSubmit = async (data: AgentConfigFormValues) => {
    try {
      await setAgentConfig({
        companyId: company?.id!,
        payload: {
          sync_interval_seconds: minutesToSeconds(data.syncIntervalMinutes),
        },
      }).unwrap();

      displaySuccessMessage(
        "Agent configuration updated",
        "Your devices will use the new sync frequency on their next check-in.",
      );
      refetch();
    } catch (error) {
      console.error("Failed to update agent configuration:", error);
    }
  };

  const onReset = async () => {
    try {
      await resetAgentConfig({ companyId: company?.id! }).unwrap();
      reset({ syncIntervalMinutes: DEFAULT_MINUTES });

      displaySuccessMessage(
        "Agent configuration reset",
        `The sync frequency has been reset to the default of ${DEFAULT_MINUTES} minutes.`,
      );
      refetch();
    } catch (error) {
      console.error("Failed to reset agent configuration:", error);
    }
  };

  return (
    <PageState
      isLoading={isLoading_getAgentConfig || isFetching_getAgentConfig}
      isError={getAgentConfig_error}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="lg:w-[320px]">
              <h2 className="text-lg font-semibold">Agent configuration</h2>
              <p className="text-sm text-muted-foreground">
                Control how often your devices&apos; Rayda agents send telemetry
                snapshots. Changes apply on each device&apos;s next check-in.
              </p>
            </div>

            <div className="flex-1">
              <div className="border-b pb-6 max-w-[480px]">
                <FormField
                  control={control}
                  name="syncIntervalMinutes"
                  rules={{
                    required: "Sync frequency is required",
                    min: {
                      value: MIN_MINUTES,
                      message: `Minimum is ${MIN_MINUTES} minute`,
                    },
                    max: {
                      value: MAX_MINUTES,
                      message: `Maximum is ${MAX_MINUTES} minutes (24 hours)`,
                    },
                    validate: (value) =>
                      Number.isInteger(Number(value)) ||
                      "Enter a whole number of minutes",
                  }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-sm font-semibold">
                        Telemetry sync frequency
                      </FormLabel>
                      <div className="flex items-center gap-2 border border-gray-300 rounded-[8px] pr-3">
                        <FormControl>
                          <Input
                            type="number"
                            min={MIN_MINUTES}
                            max={MAX_MINUTES}
                            placeholder="Enter sync frequency"
                            className="w-full h-[40px] border-none"
                            data-testid="agentconfig-input"
                            value={
                              field.value === undefined ||
                              Number.isNaN(field.value)
                                ? ""
                                : field.value
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(
                                val === "" ? undefined : Number(val),
                              );
                            }}
                          />
                        </FormControl>
                        <span className="text-gray-900 whitespace-nowrap">
                          minutes
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Choose a value between {MIN_MINUTES} minute and{" "}
                        {MAX_MINUTES} minutes (24 hours).
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={isResetting || isSaving}
              data-testid="agentconfig-button"
            >
              Reset to default
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSaving || isResetting}
              data-testid="agentconfig-button-2"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </PageState>
  );
};

export default AgentConfig;
