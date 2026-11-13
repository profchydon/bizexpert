import React from "react";
import Autocomplete, { SingleSelectValue } from "@/components/ui/autocomplete";
import { Form } from "@/components/ui/form";
import FormField from "@/components/Custom/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useWorkspaceDashboardCountrySummaryQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { countryMapSchema } from "../../OverviewDashboardMap/CountrySelectMap/validation";
import { useMapContext } from "../../OverviewDashboardMap/CountrySelectMap/MapContext";

const CountrySelectCard = () => {
  const { changeDefaultCountry, defaultCountry } = useMapContext();
  const { data: getCountries } = useGetCountriesQuery();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const { data: dashboardCountrySummaryRes } =
    useWorkspaceDashboardCountrySummaryQuery({ skip: !company?.id });

  const dashboardCountrySummary = dashboardCountrySummaryRes?.data ?? [];

  const countrySummaryData =
    dashboardCountrySummary.map((countrySummary) => ({
      label: countrySummary?.country,
      value: countrySummary?.country_id,
    })) ?? [];

  const form = useForm<z.infer<typeof countryMapSchema>>({
    resolver: zodResolver(countryMapSchema),
    defaultValues: {
      add_country: {
        label: null,
        value: null,
      },
    },
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="add_country"
          label=""
          className=""
          render={({ field: { onChange, value, ...restField } }) => (
            <Autocomplete
              {...restField}
              options={countrySummaryData ?? []}
              setSelectedOption={(option) => {
                onChange(option);
                changeDefaultCountry(option as SingleSelectValue);
              }}
              selectedOption={defaultCountry}
              isSearchable
              isClearable
              placeholder="Select Country"
              data-testid="countryselectcard-autocomplete"
            />
          )}
        />
      </form>
    </Form>
  );
};

export default CountrySelectCard;
