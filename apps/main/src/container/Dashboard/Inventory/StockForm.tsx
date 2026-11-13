"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/base/input/input";
import type { Product } from "@/types/bizexpert";
import type { StockFormValues } from "./inventoryPayloads";
import { stockFormSchema } from "./inventorySchemas";
import { ProductSelectField } from "./ProductSelectField";

type Props = {
  products: Product[] | undefined;
  showNotes?: boolean;
  submitLabel: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: StockFormValues) => void;
};

export function StockForm({
  products,
  showNotes,
  submitLabel,
  isSubmitting,
  onCancel,
  onSubmit,
}: Props) {
  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: { productId: "", quantity: 0, unitCost: 0, notes: "" },
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
          label="Quantity"
          type="number"
          value={String(form.watch("quantity") || "")}
          onChange={(value) =>
            form.setValue("quantity", Number(value), { shouldValidate: true })
          }
          isInvalid={Boolean(form.formState.errors.quantity)}
          hint={form.formState.errors.quantity?.message}
        />
        <Input
          label="Unit cost"
          type="number"
          value={String(form.watch("unitCost") || "")}
          onChange={(value) =>
            form.setValue("unitCost", Number(value), { shouldValidate: true })
          }
          isInvalid={Boolean(form.formState.errors.unitCost)}
          hint={form.formState.errors.unitCost?.message}
        />
        {showNotes ? (
          <Input
            label="Notes"
            value={form.watch("notes") ?? ""}
            onChange={(value) => form.setValue("notes", value)}
          />
        ) : null}
      </SlideoutMenu.Content>
      <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </SlideoutMenu.Footer>
    </form>
  );
}
