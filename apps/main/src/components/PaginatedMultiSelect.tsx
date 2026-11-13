import React, { useCallback } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import type { LoadOptions } from "react-select-async-paginate";
import type { MultiValue, ActionMeta, GroupBase } from "react-select";

export interface OptionType {
  label: string;
  value: string;
  [key: string]: any;
}

interface PaginatedMultiSelectProps<T> {
  useLazyQuery: () => readonly [
    (args: { params?: { name?: string; page?: number } }) => any,
    { data?: T; isLoading: boolean },
    ...any[],
  ];
  mapOptions: (data: T) => OptionType[];
  selectedValues: OptionType[];
  onChange: (
    value: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => void;
  placeholder?: string;
}

export const PaginatedMultiSelect = <T,>({
  useLazyQuery,
  mapOptions,
  selectedValues,
  onChange,
  placeholder = "Select options...",
}: PaginatedMultiSelectProps<T>) => {
  const [triggerQuery, { data }] = useLazyQuery();

  const loadOptions: LoadOptions<
    OptionType,
    GroupBase<OptionType>,
    { page: number }
  > = async (inputValue, loadedOptions, additional) => {
    const pageNumber = additional?.page ?? 1;

    const response = await triggerQuery({
      params: { name: inputValue, page: pageNumber },
    });
    const result = response.data || response;
    const options = mapOptions(result);

    const hasMore =
      (result?.meta?.hasNextPage ?? result?.nextPage !== undefined) ||
      options.length === 10;

    return {
      options,
      hasMore,
      additional: {
        page: pageNumber + 1,
      },
    };
  };

  return (
    <AsyncPaginate
      isMulti
      value={selectedValues}
      loadOptions={loadOptions}
      onChange={onChange}
      additional={{ page: 1 }}
      debounceTimeout={2000}
      placeholder={placeholder}
    />
  );
};
