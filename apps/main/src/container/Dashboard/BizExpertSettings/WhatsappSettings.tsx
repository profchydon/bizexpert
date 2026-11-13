"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { WhatsappIdentity } from "@/types/bizexpert";
import { readSettingsApiError } from "./settingsApiError";
import { settingsQueryKeys } from "./settingsQueryKeys";
import { UnlinkWhatsappModal } from "./UnlinkWhatsappModal";
import { WhatsappIdentitiesList } from "./WhatsappIdentitiesList";
import {
  toWhatsappLinkPayload,
  whatsappLinkDefaults,
  whatsappLinkSchema,
  type WhatsappLinkValues,
} from "./whatsappSchema";

export function WhatsappSettings() {
  const { businessId, locations } = useBizExpertBusiness();
  const qc = useQueryClient();
  const [unlink, setUnlink] = useState<WhatsappIdentity | null>(null);
  const form = useForm<WhatsappLinkValues>({
    resolver: zodResolver(whatsappLinkSchema),
    defaultValues: whatsappLinkDefaults,
  });

  const { data: identities } = useQuery({
    queryKey: settingsQueryKeys.identities(businessId ?? ""),
    enabled: Boolean(businessId),
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/whatsapp-identities`,
      );
      return res.data as WhatsappIdentity[];
    },
  });

  const link = useMutation({
    mutationFn: async (values: WhatsappLinkValues) => {
      await bizexpertApi.post(
        `/businesses/${businessId}/whatsapp-identities`,
        toWhatsappLinkPayload(values),
      );
    },
    onSuccess: async () => {
      form.reset(whatsappLinkDefaults);
      toast.success("Number linked — reply VERIFY on WhatsApp");
      await qc.invalidateQueries({
        queryKey: settingsQueryKeys.identities(businessId ?? ""),
      });
    },
    onError: (err) => toast.error(readSettingsApiError(err, "Failed")),
  });

  const remove = useMutation({
    mutationFn: async (identity: WhatsappIdentity) => {
      await bizexpertApi.delete(
        `/businesses/${businessId}/whatsapp-identities/${identity.id}`,
      );
    },
    onSuccess: async () => {
      setUnlink(null);
      toast.success("WhatsApp number unlinked");
      await qc.invalidateQueries({
        queryKey: settingsQueryKeys.identities(businessId ?? ""),
      });
    },
    onError: (err) =>
      toast.error(readSettingsApiError(err, "Failed to unlink")),
  });

  if (!businessId) {
    return (
      <p className="py-8 text-secondary">
        No business selected.{" "}
        <a href="/onboarding/business" className="text-brand-600 underline">
          Create one
        </a>
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Link Number</CardTitle>
          <CardDescription>
            Link your E.164 phone number, then reply VERIFY to the BizExpert
            message on WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => link.mutate(values))}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="WhatsApp number"
                placeholder="+2348012345678"
                value={form.watch("whatsappPhone")}
                onChange={(value) =>
                  form.setValue("whatsappPhone", value, {
                    shouldValidate: true,
                  })
                }
                isInvalid={Boolean(form.formState.errors.whatsappPhone)}
                hint={form.formState.errors.whatsappPhone?.message}
                isRequired
              />
              <NativeSelect
                label="Default location (optional)"
                value={form.watch("defaultLocationId") ?? ""}
                onChange={(event) =>
                  form.setValue("defaultLocationId", event.target.value)
                }
                options={[
                  { value: "", label: "No default location" },
                  ...locations.map((location) => ({
                    value: location.id,
                    label: location.name,
                  })),
                ]}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={link.isPending}
              >
                Link number
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {identities && identities.length > 0 ? (
        <WhatsappIdentitiesList
          identities={identities}
          locations={locations}
          onUnlink={setUnlink}
        />
      ) : null}
      {unlink ? (
        <UnlinkWhatsappModal
          isOpen
          identity={unlink}
          isUnlinking={remove.isPending}
          onClose={() => setUnlink(null)}
          onConfirm={() => remove.mutate(unlink)}
        />
      ) : null}
    </div>
  );
}
