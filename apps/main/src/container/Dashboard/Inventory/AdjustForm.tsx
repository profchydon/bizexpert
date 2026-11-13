"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/base/input/input";
import type { Product } from "@/types/bizexpert";
import type { AdjustFormValues } from "./inventoryPayloads";
import { adjustFormSchema } from "./inventorySchemas";
import { ProductSelectField } from "./ProductSelectField";

type Props = {
  products: Product[] | undefined;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: AdjustFormValues) => void;
};

export function AdjustForm({
  products,
  isSubmitting,
  onCancel,
  onSubmit,
}: Props) {
  const form = useForm<AdjustFormValues>({
    resolver: zodResolver(adjustFormSchema),
    defaultValues: { productId: "", quantity: 0, reason: "" },
  });

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <SlideoutMenu.Content>
        <ProductSelectField
          products={products}
          value={form.watch("productId")}
          onChange={(value) =>
            form.setValue("productId", value, { shouldValidate: true })
          }
          isInvalid={Boolean(form.formState.errors.productId)}
          hint={form.formState.errors.productId?.message}
        />
        <Input
          label="Quantity change"
          type="number"
          placeholder="+10 or -2"
          value={String(form.watch("quantity") || "")}
          onChange={(value) =>
            form.setValue("quantity", Number(value), { shouldValidate: true })
          }
          isInvalid={Boolean(form.formState.errors.quantity)}
          hint={form.formState.errors.quantity?.message}
        />
        <Input
          label="Reason"
          value={form.watch("reason")}
          onChange={(value) =>
            form.setValue("reason", value, { shouldValidate: true })
          }
          isInvalid={Boolean(form.formState.errors.reason)}
          hint={form.formState.errors.reason?.message}
        />
      </SlideoutMenu.Content>
      <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Post adjustment
        </Button>
      </SlideoutMenu.Footer>
    </form>
  );
}
