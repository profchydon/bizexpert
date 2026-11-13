"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import type { Category } from "@/types/bizexpert";
import type { CategoryFormValues } from "./categorySchema";
import { isMainCategory } from "./categoryHierarchyDisplay";

type Props = {
  form: UseFormReturn<CategoryFormValues>;
  mainCategories: Category[];
  fixedParent?: Category | null;
  isEdit: boolean;
};

export function CategoryFormFields({
  form,
  mainCategories,
  fixedParent,
  isEdit,
}: Props) {
  const isSub = Boolean(fixedParent) || Boolean(form.watch("parentId"));

  return (
    <>
      {!isEdit && !fixedParent ? (
        <NativeSelect
          label="Level"
          value={form.watch("parentId") ? "sub" : "main"}
          onChange={(event) => {
            if (event.target.value === "main") {
              form.setValue("parentId", "");
              return;
            }
            const first = mainCategories.find(isMainCategory);
            form.setValue("parentId", first?.id ?? "");
          }}
          options={[
            { value: "main", label: "Main category" },
            { value: "sub", label: "Sub-category" },
          ]}
        />
      ) : null}
      {!isEdit && (fixedParent || form.watch("parentId")) ? (
        fixedParent ? (
          <Input label="Main category" value={fixedParent.name} isDisabled />
        ) : (
          <NativeSelect
            label="Main category"
            value={form.watch("parentId") ?? ""}
            onChange={(event) => form.setValue("parentId", event.target.value)}
            options={[
              { value: "", label: "Select main category" },
              ...mainCategories.filter(isMainCategory).map((row) => ({
                value: row.id,
                label: row.name,
              })),
            ]}
          />
        )
      ) : null}
      {isEdit && fixedParent ? (
        <Input label="Main category" value={fixedParent.name} isDisabled />
      ) : null}
      <Input
        label={isSub ? "Sub-category name" : "Category name"}
        placeholder={isSub ? "Soft drinks" : "Beverages"}
        value={form.watch("name")}
        onChange={(value) =>
          form.setValue("name", value, { shouldValidate: true })
        }
        isInvalid={Boolean(form.formState.errors.name)}
        hint={form.formState.errors.name?.message}
      />
    </>
  );
}
