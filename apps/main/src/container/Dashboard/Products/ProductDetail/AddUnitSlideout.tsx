"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/base/input/input";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useQueryClient } from "@tanstack/react-query";
import { readProductsApiError } from "../productsApiError";
import { PRODUCT_FORM_SLIDEOUT_RESIZE } from "../productsPageClasses";
import { productsQueryKeys } from "../productsQueryKeys";
import {
  addUnitDefaults,
  addUnitSchema,
  toAddUnitPayload,
  type AddUnitValues,
} from "./unitSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  productId: string;
  baseUnit: string;
};

export function AddUnitSlideout({
  isOpen,
  onClose,
  businessId,
  productId,
  baseUnit,
}: Props) {
  const qc = useQueryClient();
  const form = useForm<AddUnitValues>({
    resolver: zodResolver(addUnitSchema),
    defaultValues: addUnitDefaults,
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(addUnitDefaults);
  }, [form, isOpen]);

  const close = () => {
    form.reset(addUnitDefaults);
    onClose();
  };

  const onSubmit = async (values: AddUnitValues) => {
    try {
      await bizexpertApi.post(
        `/businesses/${businessId}/products/${productId}/units`,
        toAddUnitPayload(values),
      );
      toast.success("Unit added");
      await qc.invalidateQueries({
        queryKey: productsQueryKeys.detail(businessId, productId),
      });
      close();
    } catch (err) {
      toast.error(readProductsApiError(err, "Failed to add unit"));
    }
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && close()}
      isDismissable
      ariaLabel="Add packaging unit"
      resizeOptions={PRODUCT_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={close}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">
          Add packaging unit
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          Conversion factor is how many {baseUnit}s make one of this unit.
        </p>
      </SlideoutMenu.Header>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SlideoutMenu.Content>
          <Input
            label="Unit name"
            placeholder="carton"
            value={form.watch("unitName")}
            onChange={(value) =>
              form.setValue("unitName", value, { shouldValidate: true })
            }
            isInvalid={Boolean(form.formState.errors.unitName)}
            hint={form.formState.errors.unitName?.message}
          />
          <Input
            label={`Factor vs ${baseUnit}`}
            type="number"
            value={String(form.watch("conversionFactor") || "")}
            onChange={(value) =>
              form.setValue("conversionFactor", Number(value), {
                shouldValidate: true,
              })
            }
            isInvalid={Boolean(form.formState.errors.conversionFactor)}
            hint={form.formState.errors.conversionFactor?.message}
          />
          <Input
            label="Selling price"
            type="number"
            placeholder="Optional"
            value={String(form.watch("sellingPrice") || "")}
            onChange={(value) =>
              form.setValue("sellingPrice", Number(value) || 0)
            }
          />
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
          <Button type="button" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            Add unit
          </Button>
        </SlideoutMenu.Footer>
      </form>
    </SlideoutMenu>
  );
}
