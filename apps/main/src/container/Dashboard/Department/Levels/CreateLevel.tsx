import React, { useState } from "react";
import { z } from "zod";

import DrawerRight from "@/components/DrawerRight";
import { useForm } from "react-hook-form";
import { createLevelSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Autocomplete, { MultiSelectValue } from "@/components/ui/autocomplete";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import FormField from "@/components/Custom/FormField";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { Form } from "@/components/ui/form";
import { useCreateLevelMutation } from "@/api/baseQueries/companiesApi/levelsApi/createLevel";
import { useDepartmentMemberSelectOptions } from "../useDepartmentMemberSelectOptions";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLevek: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedValue, setSelectedValue] = useState<MultiSelectValue>([]);
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const { options: memberOptions } =
    useDepartmentMemberSelectOptions(companyId);

  const [createLevel, createLevelProps] = useCreateLevelMutation();

  const form = useForm<z.infer<typeof createLevelSchema>>({
    resolver: zodResolver(createLevelSchema),
    defaultValues: {
      level_name: "",
      members: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof createLevelSchema>) => {
    const members = selectedValue.map((member) => member.value);

    try {
      await createLevel({
        companyId: companyId!,
        members,
        name: data.level_name,
      }).unwrap();
      displaySuccessMessage(
        "Level Successfully created",
        "You have successfully created a new level",
      );
      onClose();
      form.reset();
      setSelectedValue([]);
    } catch (error) {
      showApiError(error);
    }
  };

  return (
    <Form {...form}>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        onSave={() => null}
        drawerDescription="Fill in the required fields below"
        drawerTitle="Create level"
        hideDefaultFooterBtn
        data-testid="createlevel-drawerright"
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="level_name"
              label="Level name"
              render={({ field }) => (
                <Input
                  placeholder="Enter level name"
                  {...field}
                  data-testid="createlevel-input"
                />
              )}
            />

            <FormField
              control={form.control}
              name="members"
              label="Add members(Optional)"
              render={() => (
                <Autocomplete
                  options={memberOptions}
                  setSelectedOption={(value) => {
                    setSelectedValue(value as MultiSelectValue);
                  }}
                  selectedOption={selectedValue}
                  isSearchable
                  isMulti
                  placeholder="Enter member's name"
                  data-testid="createlevel-autocomplete"
                />
              )}
            />
          </div>

          <DrawerFooter
            onClose={onClose}
            onSubmit={() => null}
            saveText="Create Level"
            submitButtonType="submit"
            disableSubmitButton={createLevelProps.isLoading}
          />
        </form>
      </DrawerRight>
    </Form>
  );
};

export default CreateLevek;
