import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useForm } from "react-hook-form";
import { addEquipmentNoteSchema } from "./validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/Custom/FormField";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { useAddEquipmentNoteMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/addEquipmentNote";
import { AddEquipmentNoteRequest } from "@/types/equipments";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  equipmentId: string;
  defaultValues: string;
}

const AddEquipmentNote: React.FC<Props> = ({
  isOpen,
  onClose,
  companyId,
  equipmentId,
  defaultValues,
}) => {
  const [addEquipmentNote] = useAddEquipmentNoteMutation();

  const form = useForm<z.infer<typeof addEquipmentNoteSchema>>({
    resolver: zodResolver(addEquipmentNoteSchema),

    defaultValues: {
      note: "",
    },
  });

  const handleSave = async (data: z.infer<typeof addEquipmentNoteSchema>) => {
    const payload = {
      companyId,
      equipmentId,
      payload: data,
    } as AddEquipmentNoteRequest;

    return await addEquipmentNote(payload)
      .unwrap()
      .then(async (res) => {
        displaySuccessMessage(
          "Equipment note added successfully",
          "The equipment note has been added in the company roster.",
        );
        form.reset();
        onClose();
      })
      .catch(showApiError);
  };

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={() => {}}
      hideDefaultFooterBtn={true}
      drawerTitle={`Equipment note`}
      drawerDescription="Add notes for your equipment here"
      data-testid="addequipmentnote-drawerright"
    >
      <>
        <Form {...form}>
          <form
            className="flex flex-col h-full"
            onSubmit={form.handleSubmit(handleSave)}
          >
            <div className="flex-1 overflow-auto">
              <FormField
                className="col-span-2"
                control={form.control}
                name="note"
                label="Add note (Optional)"
                render={({ field: { onChange, ...restField } }) => (
                  <Textarea
                    placeholder="The phone seems to be in good shape."
                    {...restField}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    rows={7}
                  />
                )}
              />
            </div>
            <DrawerFooter
              onClose={onClose}
              submitButtonType={"submit"}
              disableSubmitButton={
                !form.formState.isValid || form?.formState?.isSubmitting
              }
            />
          </form>
        </Form>
      </>
    </DrawerRight>
  );
};

export default AddEquipmentNote;
