import React from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentFilterSchema } from "./validation";
import { Form } from "@/components/ui/form";
import EquipmentsActions from "./EquipmentActions";
import StatusActions from "./StatusActionc";
import AcquisitionActions from "./AcquisitionActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const FilterEquipments: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const form = useForm<z.infer<typeof equipmentFilterSchema>>({
    resolver: zodResolver(equipmentFilterSchema),
    defaultValues: {
      type: [],
      status: [],
      acquisition: [],
    },
  });

  const onSubmit = (data: z.infer<typeof equipmentFilterSchema>) => {};

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={onSave}
      drawerTitle="Filters"
      drawerDescription="Apply filters to table data.."
      hideDefaultFooterBtn
      data-testid="filterallequipments-drawerright"
    >
      <div className="flex flex-col flex-grow mb-24 ">
        <Form {...form}>
          <div className="pb-2">
            <span className="text-sm font-semibold text-black">Equipment</span>
          </div>

          <form
            className="flex flex-col "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div>
              <EquipmentsActions form={form} />
            </div>

            <div className="pb-2 pt-2">
              <span className="text-sm font-semibold text-black">Status</span>
            </div>

            <div>
              <StatusActions form={form} />
            </div>

            <div className="pb-2 pt-2">
              <span className="text-sm font-semibold text-black">
                Acquisition type
              </span>
            </div>

            <div>
              <AcquisitionActions form={form} />
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
                    data-testid="filterallequipments-button"
                  >
                    Cancel
                  </Button>

                  <Button
                    className="text-sm font-semibold text-[#FFFFFF] bg-[#004CCC]"
                    type="submit"
                    disabled={form?.formState?.isSubmitting}
                    data-testid="filterallequipments-button-2"
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

export default FilterEquipments;
