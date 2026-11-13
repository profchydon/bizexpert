import React, { useEffect, useState } from "react";
import { z } from "zod";

import DrawerRight from "@/components/DrawerRight";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createLevelSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Autocomplete, { MultiSelectValue } from "@/components/ui/autocomplete";
import FormField from "@/components/Custom/FormField";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { useEditLevelMutation } from "@/api/baseQueries/companiesApi/levelsApi/editLevel";
import { ILevel } from "@/types/departments";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  mapDepartmentMembersToSelectedOptions,
  useDepartmentMemberSelectOptions,
} from "../useDepartmentMemberSelectOptions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  level?: ILevel;
}

const EditLevels: React.FC<Props> = ({ isOpen, onClose, level }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const form = useForm<z.infer<typeof createLevelSchema>>({
    resolver: zodResolver(createLevelSchema),
    defaultValues: {
      level_name: "",
      members: undefined,
    },
  });

  const [editLevel, editLevelProps] = useEditLevelMutation();
  const [selectedValue, setSelectedValue] = useState<MultiSelectValue>([]);
  const { options: memberOptions } =
    useDepartmentMemberSelectOptions(companyId);

  const onSubmit = async (data: z.infer<typeof createLevelSchema>) => {
    const members = selectedValue.map((member) => member.value);

    if (!level) return;

    try {
      await editLevel({
        companyId: companyId!,
        levelId: level.id!,
        name: data.level_name,
        members: members,
      }).unwrap();
      displaySuccessMessage("Level updated");
      form.reset();
      setSelectedValue([]);
      onClose();
    } catch (error) {
      showApiError(error);
    }
  };

  useEffect(() => {
    if (!level) {
      return;
    }

    form.setValue("level_name", level.name!);
    setSelectedValue(
      level.members?.length
        ? mapDepartmentMembersToSelectedOptions(level.members)
        : [],
    );
  }, [level, form]);

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        onSave={() => null}
        hideDefaultFooterBtn
        drawerTitle="Edit level"
        drawerDescription="You can make changes to this level here"
        data-testid="editlevels-drawerright"
      >
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="level_name"
              label="Level name"
              render={({ field }) => (
                <Input
                  placeholder="Enter level name"
                  {...field}
                  data-testid="editlevels-input"
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
                  data-testid="editlevels-autocomplete"
                />
              )}
            />

            <DrawerFooter
              onSubmit={() => null}
              onClose={onClose}
              submitButtonType="submit"
              disableSubmitButton={editLevelProps.isLoading}
            />
          </form>
        </Form>
      </DrawerRight>
    </div>
  );
};

export default EditLevels;
