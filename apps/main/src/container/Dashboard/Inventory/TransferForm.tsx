"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import type { Location, Product } from "@/types/bizexpert";
import type { TransferFormValues } from "./inventoryPayloads";
import { transferFormSchema } from "./inventorySchemas";
import { ProductSelectField } from "./ProductSelectField";

type Props = {
  loc: string;
  locations: Location[];
  products: Product[] | undefined;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: TransferFormValues) => void;
};

export function TransferForm({
  loc,
  locations,
  products,
  isSubmitting,
  onCancel,
  onSubmit,
}: Props) {
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      sourceLocationId: loc,
      destinationLocationId: "",
      productId: "",
      quantity: 0,
      notes: "",
    },
  });

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <SlideoutMenu.Content>
        <NativeSelect
          label="From"
          required
          value={form.watch("sourceLocationId")}
          onChange={(event) =>
            form.setValue("sourceLocationId", event.target.value, {
              shouldValidate: true,
            })
          }
          options={locations.map((location) => ({
            value: location.id,
            label: location.name,
          }))}
        />
        <NativeSelect
          label="To"
          required
          value={form.watch("destinationLocationId")}
          onChange={(event) =>
            form.setValue("destinationLocationId", event.target.value, {
              shouldValidate: true,
            })
          }
          hint={form.formState.errors.destinationLocationId?.message}
          options={[
            { value: "", label: "Select destination", disabled: true },
            ...locations.map((location) => ({
              value: location.id,
              label: location.name,
            })),
          ]}
        />
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
          label="Notes"
          value={form.watch("notes") ?? ""}
          onChange={(value) => form.setValue("notes", value)}
        />
      </SlideoutMenu.Content>
      <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Dispatch transfer
        </Button>
      </SlideoutMenu.Footer>
    </form>
  );
}
