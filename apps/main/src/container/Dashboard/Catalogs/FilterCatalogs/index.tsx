import React from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { catalogFilterSchema } from "./validation";
import { Form } from "@/components/ui/form";
import CatalogType from "./CatalogType";
import CatalogLevel from "./CatalogLevel";
import CatalogCountry from "./CatalogCountry";
import CatalogDepartment from "./CatalogDepartment";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const FilterCatalogs: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const form = useForm<z.infer<typeof catalogFilterSchema>>({
    resolver: zodResolver(catalogFilterSchema),
    defaultValues: {
      type: [],
      level: [],
      country: [],
      department: [],
    },
  });

  const onSubmit = (data: z.infer<typeof catalogFilterSchema>) => {};

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      drawerTitle="Filters"
      drawerDescription="Apply filters to table data.."
      hideDefaultFooterBtn
      data-testid="filtercatalogs-drawerright"
    >
      <div className="flex flex-col flex-grow mb-24 ">
        <Form {...form}>
          <div className="pb-2">
            <span className="text-sm font-semibold text-black">
              Catalog type
            </span>
          </div>

          <form
            className="flex flex-col gap-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="text-sm font-semibold text-gray-700">
              <CatalogType form={form} />
            </div>

            <div className="">
              <span className="text-sm font-semibold text-black">Country</span>
            </div>

            <div className="text-sm font-semibold text-gray-700">
              <CatalogCountry form={form} />
            </div>

            <div className="">
              <span className="text-sm font-semibold text-black">
                Department
              </span>
            </div>

            <div className="text-sm font-medium text-gray-700">
              <CatalogDepartment form={form} />
            </div>

            <div className="">
              <span className="text-sm font-semibold text-black">Level</span>
            </div>

            <div className="text-sm font-semibold text-gray-700">
              <CatalogLevel form={form} />
            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 ">
              <div className="absolute top-[25px] hover:cursor-pointer ">
                <span className="text-primary-700 font-semibold text-sm">
                  save filter
                </span>
              </div>
              <div className="grid place-content-end my-auto h-full w-full">
                <div className="flex gap-x-6 ">
                  <Button
                    className=" text-sm font-semibold"
                    variant="outline"
                    onClick={onClose}
                    data-testid="filtercatalogs-button"
                  >
                    Cancel
                  </Button>

                  <Button
                    className="text-sm font-semibold text-white bg-primary-600"
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    data-testid="filtercatalogs-button-2"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DrawerRight>
  );
};

export default FilterCatalogs;
