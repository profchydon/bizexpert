import React from "react";
import CreatableSelectField from "./CreatableSelectField";
import { OnChangeValue } from "react-select";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import useLevel from "@/hooks/useLevel";
import { useCreateLevelMutation } from "@/api/baseQueries/companiesApi/levelsApi/createLevel";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  onChange: (value: string) => void;
  defaultValue?: string;
  isName?: boolean;
}

const LevelField: React.FC<Props> = ({ onChange, defaultValue, isName }) => {
  const companyId = useWorkspaceCompanyId();

  const { getLevels } = useLevel();
  const formatLevelValueLabel = useTransformToValueLabel(
    // @ts-ignore
    getLevels?.data?.data,
  );

  const [createLevel, createLevelProps] = useCreateLevelMutation();

  const handleCreateLevelOption = async (inputValue: string) => {
    const newOption = { value: inputValue, label: inputValue };

    return await createLevel({
      name: newOption?.label as string,
      companyId: companyId!,
      members: [],
    })
      .unwrap()
      .then((res) => {
        displaySuccessMessage("Level created");
      })
      .catch(showApiError);
  };

  const defaultInstance = !isName
    ? formatLevelValueLabel?.find((item) => item.value === defaultValue)
    : formatLevelValueLabel?.find((item) => item.label === defaultValue);

  return (
    <CreatableSelectField
      options={formatLevelValueLabel}
      isLoading={createLevelProps?.isLoading}
      onChange={(
        newValue: OnChangeValue<{ value: string; label: string }, false>,
      ) => {
        onChange(newValue?.value!);
      }}
      onCreateOption={handleCreateLevelOption}
      placeholder="Select or create level"
      defaultValue={defaultInstance as any}
    />
  );
};

export default LevelField;
