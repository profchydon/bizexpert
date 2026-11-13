"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";

import DrawerRight from "@/components/DrawerRight";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { configureCatalogSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import FormField from "@/components/Custom/FormField";
import { ICatalog } from "@/types/catalog";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useGetAssetCategoriesQuery } from "@/api/baseQueries/assetsApi/getAssetCategories";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { useUpdateCatalogCategoriesMutation } from "@/api/baseQueries/companiesApi/catalogsApi/updateCatalogCategories";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  catalog?: ICatalog;
}

const ItemQuantityConfig: React.FC<Props> = ({
  isOpen,
  onClose,
  catalog: catalogData,
}) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const { data: catRes } = useGetAssetCategoriesQuery();
  const categories = catRes?.data ?? [];

  const { data: catalogRes, isLoading } = useGetCatalogQuery(
    {
      catalogId: catalogData?.id!,
      companyId: companyId!,
    },
    { skip: !catalogData },
  );
  const catalog = catalogRes?.data;

  const form = useForm<z.infer<typeof configureCatalogSchema>>({
    resolver: zodResolver(configureCatalogSchema),
    // defaultValues: {
    //   computer: "1",
    //   imac: "1",
    //   laptop: "1",
    //   macbook: "1",
    //   machinery: "1",
    //   monitor: "1",
    //   workstation: "1",
    //   printer: "1",
    // },
  });

  const [updateCategories, updateCategoriesProps] =
    useUpdateCatalogCategoriesMutation();

  const onSubmit = async (data: z.infer<typeof configureCatalogSchema>) => {
    const payload = categories.map((cat) => {
      const lowercaseKey = cat.name.toLowerCase();
      const copiedData = { ...data } as any;

      const ids = {
        id: cat.id,
        quantity: Number(copiedData[lowercaseKey as string] ?? 1),
      };
      return ids;
    });
    await updateCategories({
      catalogId: catalog?.id!,
      companyId: companyId!,
      categories: payload,
    })
      .unwrap()
      .then((res) => {
        displaySuccessMessage("Updated successfully");
        form.reset();
        onClose();
      })
      .catch(showApiError);
  };

  useEffect(() => {
    const catalogCats = catalog?.categories;

    if (catalogCats) {
      const transformedCats: { [key: string]: string } = catalogCats.reduce(
        (acc, item) => {
          acc[item.name.toLowerCase() as unknown as string] =
            item.quantity.toString();
          return acc;
        },
        {} as { [key: string]: string },
      );
      form.reset(transformedCats);
    }
  }, [catalog?.categories]);

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        drawerTitle="Configure Catalog"
        drawerDescription="Customize the catalog to meet the unique needs of your team."
        hideDefaultFooterBtn
        data-testid="itemquantityconfig-drawerright"
      >
        <div className="mb-[74px]">
          <div>
            <h2 className="font-medium text-sm text-gray-700">
              Items quantity
            </h2>
            <span className="font-normal text-sm">
              Select the quantity limit on each equipment per employee
            </span>
          </div>
          <Form {...form}>
            <form
              className="space-y-5 mt-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {categories?.map((category) => (
                <FormField
                  key={category.id}
                  control={form.control}
                  name={category.name.toLowerCase()}
                  label={category.name}
                  render={({ field: { onChange, ...rest } }) => (
                    <Input
                      placeholder="Enter Quantity"
                      type="number"
                      onChange={(e) => onChange(e.target.value)}
                      {...rest}
                      data-testid="itemquantityconfig-input"
                    />
                  )}
                />
              ))}

              <DrawerFooter
                onClose={onClose}
                submitButtonType="submit"
                disableSubmitButton={updateCategoriesProps.isLoading}
              />
            </form>
          </Form>
        </div>
      </DrawerRight>
    </div>
  );
};

export default ItemQuantityConfig;
