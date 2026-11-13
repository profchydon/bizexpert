import { useMemo } from "react";
import type { OnChangeValue } from "react-select";

import { useGetJobTitlesQuery } from "@/api/baseQueries/companiesApi/jobTitlesApi/getJobTitles";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  jobTitlesToOptions,
  type JobTitleOption,
} from "@/utils/jobTitleOptions";

import CreatableSelectField from "./CreatableSelectField";

type JobTitleFieldProps = {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function JobTitleField({
  value,
  onChange,
  placeholder = "Select job title",
}: JobTitleFieldProps) {
  const companyId = useWorkspaceCompanyId();
  const jobTitlesQuery = useGetJobTitlesQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );
  const options = useMemo(
    () => jobTitlesToOptions(jobTitlesQuery.data),
    [jobTitlesQuery.data],
  );
  const selected = selectedJobTitleOption(value, options);

  return (
    <CreatableSelectField
      options={options}
      isLoading={jobTitlesQuery.isFetching}
      onChange={(newValue: OnChangeValue<JobTitleOption, false>) =>
        onChange(newValue?.value ?? "")
      }
      onCreateOption={(inputValue) => onChange(inputValue)}
      placeholder={placeholder}
      defaultValue={selected}
    />
  );
}

function selectedJobTitleOption(
  value: string | null | undefined,
  options: JobTitleOption[],
) {
  if (!value) return undefined;
  return (
    options.find((option) => option.value === value) ?? { value, label: value }
  );
}
