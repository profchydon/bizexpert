import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { companyInformationSchema } from "./companyInformationSchema";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MapLocationFinder, { I_Location } from "@/components/MapLocationFinder";
import Image from "next/image";
import { company_info_stepper } from "@/assets/icons";
import { useAppSelector } from "@/store";
import { useUpdateCompanyMutation } from "@/api/baseQueries/authFlowApi/updateCompany";
import {
  buildCompanyInformationPayload,
  submitCompanyInformation,
} from "./submitCompanyInformation";
import FormField from "@/components/Custom/FormField";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTransformToValueLabel from "@/hooks/useTransformToValueLabel";
import { ICompany } from "@/types/auth";

interface Props {
  onContinue: () => void;
  getAddress?: ICompany;
}

const CompanyInformation: React.FC<Props> = ({ onContinue, getAddress }) => {
  const [address, setAddress] = useState<I_Location>();

  const { company } = useAppSelector(
    (state) => state.persistedReducers.onboarding,
  );

  const companyDetail = getAddress?.address as string;
  const { data: getCountries } = useGetCountriesQuery();
  const formateCountriesValueLabel = useTransformToValueLabel(
    getCountries?.data?.data,
  );
  const [updateCompany, updateCompanyProps] = useUpdateCompanyMutation();

  const form = useForm<z.infer<typeof companyInformationSchema>>({
    resolver: zodResolver(companyInformationSchema),
    defaultValues: {
      business_website: "",
      country: "",
      address: companyDetail || "",
    },
  });

  const { control } = form;

  const watchedFields = useWatch({ control });

  const returnCoutryName = (country_id: string) => {
    return getCountries?.data?.data?.find(
      (item: any) => item.id === country_id,
    );
  };

  const [googlePlacebyCountryInput, setGooglePlacebyCountryInput] =
    useState<string>("");

  useEffect(() => {
    const countryInput = returnCoutryName(String(form.getValues("country")));
    setGooglePlacebyCountryInput(String(countryInput?.code));
  }, [watchedFields]);

  const onSubmit = async (data: z.infer<typeof companyInformationSchema>) => {
    const countryLabel =
      formateCountriesValueLabel.find(
        (country) => country.value === data.country,
      )?.label ?? "";
    await submitCompanyInformation({
      updateCompany,
      companyId: company?.id!,
      payload: buildCompanyInformationPayload(
        company,
        data,
        countryLabel,
        address,
      ),
      onContinue,
    });
  };

  return (
    <div className="lg:grid px-10 sm:px-24 lg:px-0 place-content-center h-screen">
      <div className="flex-col flex gap-y-2">
        <div className="lg:text-3xl text-2xl font-semibold text-gray-900">
          Company information
        </div>
        <span className="text-gray-600 text-base">
          Please provide your company information.
        </span>
      </div>

      <Image
        src={company_info_stepper}
        alt="stepper_indicator_icon"
        className="mt-8"
        width={432}
        height={32}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 mt-8 w-full lg:min-w-[27rem]"
        >
          <FormField
            control={form.control}
            name="business_website"
            label="Business website (Optional)"
            render={({ field }) => (
              <Input
                placeholder="Enter business website"
                {...field}
                data-testid="companyinformation-input"
              />
            )}
          />

          <FormField
            control={form.control}
            name="country"
            label="Select country"
            render={({ field: { onChange, ...restField } }) => (
              <Select
                {...restField}
                onValueChange={(value) => {
                  onChange(value);
                }}
                data-testid="companyinformation-select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>

                <SelectContent>
                  {formateCountriesValueLabel?.map(({ value, label }) => (
                    <SelectItem value={value} key={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            label="Business address"
            render={({ field }) => (
              // <MapLocationFinder
              //   getOfficeLocation={(location) => {
              //     getOfficeLocation(location);
              //     field.onChange(location.address);
              //   }}
              //   placeholder="Enter business Address"
              //   disabled={
              //     googlePlacebyCountryInput !== "" &&
              //     googlePlacebyCountryInput !== "undefined"
              //       ? false
              //       : true
              //   }
              //   specificCountry={googlePlacebyCountryInput}
              //   {...field}
              // />
              <Input
                type="address"
                placeholder="Enter business Address"
                {...field}
                data-ph-mask
                data-testid="companyinformation-input-2"
              />
            )}
          />

          <Button
            className="w-full"
            disabled={updateCompanyProps.isLoading}
            data-testid="companyinformation-button"
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyInformation;
