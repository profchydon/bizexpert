"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { useQueryClient } from "@tanstack/react-query";
import type { Location } from "@/types/bizexpert";
import {
  createLocationDefaults,
  createLocationSchema,
  toCreateLocationPayload,
  toUpdateLocationPayload,
  valuesFromLocation,
  type CreateLocationValues,
} from "./createLocationSchema";
import { LocationFormFields } from "./LocationFormFields";
import { readLocationApiError } from "./locationApiError";
import { locationsQueryKeys } from "./locationsQueryKeys";
import { LOCATION_FORM_SLIDEOUT_RESIZE } from "./locationsPageClasses";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
};

export function CreateLocation({ isOpen, onClose, location }: Props) {
  const { businessId, refreshBusiness } = useBizExpertBusiness();
  const qc = useQueryClient();
  const isEdit = Boolean(location);
  const form = useForm<CreateLocationValues>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: location
      ? valuesFromLocation(location)
      : createLocationDefaults,
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(
      location ? valuesFromLocation(location) : createLocationDefaults,
    );
  }, [form, isOpen, location]);

  const close = () => {
    form.reset(createLocationDefaults);
    onClose();
  };

  const onSubmit = async (values: CreateLocationValues) => {
    if (!businessId) return;
    try {
      if (location) {
        await bizexpertApi.put(
          `/businesses/${businessId}/locations/${location.id}`,
          toUpdateLocationPayload(values, location.type),
        );
        toast.success("Store updated");
      } else {
        await bizexpertApi.post(
          `/businesses/${businessId}/locations`,
          toCreateLocationPayload(values),
        );
        toast.success("Store added");
      }
      await qc.invalidateQueries({
        queryKey: locationsQueryKeys.list(businessId),
      });
      await refreshBusiness();
      close();
    } catch (err) {
      toast.error(
        readLocationApiError(
          err,
          location ? "Failed to update store" : "Failed to add store",
        ),
      );
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel={isEdit ? "Edit store" : "Add store"}
      resizeOptions={LOCATION_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">
          {isEdit ? "Edit store" : "Add new store"}
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          {isEdit
            ? "Update store details, VAT, and warehouse settings."
            : "Create a regular store or warehouse for sales and stock."}
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <LocationFormFields
            form={form}
            showDefault={!isEdit}
            isEdit={isEdit}
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            {isEdit ? "Update store" : "Add new store"}
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
