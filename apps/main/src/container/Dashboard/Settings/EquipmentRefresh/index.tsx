import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import PageState from "@/components/PageState";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { useGetAssetRefreshListQuery } from "@/api/baseQueries/companiesApi/assetRefreshApi/getAssetRefreshList";
import { useCreateAssetRefreshConfigMutation } from "@/api/baseQueries/companiesApi/assetRefreshApi/createAssetRefreshConfig";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  CreateRefreshDeviceRequest,
  type IAssetRefreshItem,
} from "@/types/assetRefresh";
import {
  buildEquipmentRefreshDefaults,
  buildEquipmentRefreshList,
  isEquipmentRefreshSubmitEnabled,
  normalizeEquipmentRefreshKey,
} from "./equipmentRefreshForm";

const EquipmentRefreshForm = () => {
  const companyId = useWorkspaceCompanyId();

  const {
    data: getAssetRefreshList,
    isLoading: isLoading_getAssetRefresh,
    isFetching: isFetching_getAssetRefresh,
    isError: getAssetRefresh_error,
  } = useGetAssetRefreshListQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );

  const assetData = getAssetRefreshList?.data as
    (IAssetRefreshItem & { id?: string })[] | undefined;
  const [createAssetRefreshConfig, { isLoading: isSaving }] =
    useCreateAssetRefreshConfigMutation();

  const defaultValues = useMemo(
    () => buildEquipmentRefreshDefaults(assetData),
    [assetData],
  );

  const form = useForm({ defaultValues });
  const { watch, control, handleSubmit, setValue, reset } = form;
  const values = watch();

  useEffect(() => {
    if (assetData && assetData.length > 0) {
      reset(defaultValues);
    }
  }, [assetData, defaultValues, reset]);

  const isSubmitEnabled = useMemo(
    () => isEquipmentRefreshSubmitEnabled(assetData, values),
    [values, assetData],
  );

  const onSubmit = async (data: Record<string, unknown>) => {
    const payload: CreateRefreshDeviceRequest = {
      companyId: companyId!,
      payload: { refresh_list: buildEquipmentRefreshList(assetData, data) },
    };

    try {
      await createAssetRefreshConfig(payload).unwrap();
      displaySuccessMessage(
        "Asset Refresh Config added successfully",
        "The Asset Refresh Config has been added in the company roster.",
      );
    } catch (error) {
      showApiError(error);
    }
  };

  return (
    <PageState
      isLoading={isLoading_getAssetRefresh || isFetching_getAssetRefresh}
      isError={getAssetRefresh_error}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div>
              <h2 className="text-lg font-semibold">Equipment refresh</h2>
              <p className="text-sm text-muted-foreground">
                Select the time period for your device refresh.
              </p>
            </div>

            <div className="flex-1">
              {assetData?.map((asset) => {
                const label = asset.asset_type;
                const baseKey = normalizeEquipmentRefreshKey(label);
                const refreshKey = `${baseKey}RefreshPeriod`;

                return (
                  <div
                    key={baseKey}
                    className="flex items-center justify-between py-4 last:border-b-0"
                  >
                    <FormField
                      control={control}
                      name={baseKey}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Switch
                              className="h-[20px] w-[36px]"
                              checked={Boolean(field.value)}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-semibold">
                            {label} refresh period
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormItem className="flex items-center gap-2 rounded-[8px] border-[1px] border-gray-300 pr-3">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter refresh period"
                          min={1}
                          disabled={!values[baseKey] && !values[refreshKey]}
                          value={
                            typeof values[refreshKey] === "number"
                              ? values[refreshKey]
                              : ""
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            const numeric =
                              val === "" ? undefined : Number(val);
                            setValue(refreshKey, numeric);
                            if (numeric && !values[baseKey]) {
                              setValue(baseKey, true);
                            }
                          }}
                          className="h-[40px] w-[256px] border-none"
                          data-testid="equipmentrefresh-input"
                        />
                      </FormControl>
                      <span className="text-gray-900">Years</span>
                    </FormItem>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              data-testid="equipmentrefresh-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isSubmitEnabled}
              isLoading={isSaving}
              data-testid="equipmentrefresh-button-2"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </PageState>
  );
};

export default EquipmentRefreshForm;
