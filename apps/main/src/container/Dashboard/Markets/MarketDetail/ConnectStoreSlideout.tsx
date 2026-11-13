"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { Button } from "@/components/ui/button";
import type { Location } from "@/types/bizexpert";
import type { MarketApp } from "../marketCatalog";
import {
  marketConnectionDefaults,
  marketConnectionSchema,
  toMarketConnection,
  type MarketConnectionValues,
} from "../marketConnectionSchema";
import type { MarketRemoteStore } from "../marketDummyData";
import type { MarketConnection } from "../marketStorage";
import { MARKET_FORM_SLIDEOUT_RESIZE } from "../marketsPageClasses";

type Props = {
  isOpen: boolean;
  market: MarketApp;
  remoteStores: MarketRemoteStore[];
  locations: Location[];
  onClose: () => void;
  onConnect: (connection: MarketConnection) => void;
};

export function ConnectStoreSlideout({
  isOpen,
  market,
  remoteStores,
  locations,
  onClose,
  onConnect,
}: Props) {
  const form = useForm<MarketConnectionValues>({
    resolver: zodResolver(marketConnectionSchema),
    defaultValues: marketConnectionDefaults,
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(marketConnectionDefaults);
  }, [form, isOpen]);

  const close = () => {
    form.reset(marketConnectionDefaults);
    onClose();
  };

  const onSubmit = (values: MarketConnectionValues) => {
    const remote = remoteStores.find((row) => row.id === values.remoteStoreId);
    const location = locations.find((row) => row.id === values.locationId);
    if (!remote || !location) {
      toast.error("Select a market store and a BizExpert store");
      return;
    }
    onConnect(
      toMarketConnection({
        values,
        remoteStoreName: remote.name,
        locationName: location.name,
      }),
    );
    toast.success(`${market.name} store connected`);
    close();
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel={`Connect ${market.name}`}
      resizeOptions={MARKET_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">
          Connect {market.name} store
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Paste a dummy API key, then map a {market.name} store to a BizExpert
          store.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content className="space-y-4">
          <Input
            label="API key"
            placeholder="Dummy integration key"
            value={form.watch("apiKey")}
            onChange={(value) =>
              form.setValue("apiKey", value, { shouldValidate: true })
            }
            isInvalid={Boolean(form.formState.errors.apiKey)}
            hint={form.formState.errors.apiKey?.message}
          />
          <NativeSelect
            label={`${market.name} store`}
            value={form.watch("remoteStoreId")}
            onChange={(event) =>
              form.setValue("remoteStoreId", event.target.value, {
                shouldValidate: true,
              })
            }
            options={[
              { value: "", label: "Select store" },
              ...remoteStores.map((row) => ({
                value: row.id,
                label: `${row.name} · ${row.city}`,
              })),
            ]}
          />
          <NativeSelect
            label="BizExpert store"
            value={form.watch("locationId")}
            onChange={(event) =>
              form.setValue("locationId", event.target.value, {
                shouldValidate: true,
              })
            }
            options={[
              { value: "", label: "Select store" },
              ...locations.map((row) => ({
                value: row.id,
                label: row.name,
              })),
            ]}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Connect API</Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
