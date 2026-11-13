import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import useTransformCountriesWithETA from "@/hooks/useTransformCountriesWithETA";
import { useAppDispatch } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store";
import { trackEquipFlowStarted } from "@/lib/orderFlowAnalytics";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { selectCountrySchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { group_country_icon } from "@/assets/icons";
import FormField from "@/components/Custom/FormField";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import routes from "@/routes";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import Autocomplete, { SingleSelectValue } from "@/components/ui/autocomplete";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import useCart from "@/hooks/useCart";
import { Earth, ChevronRight } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

type CountrySelectValue =
  | (Exclude<SingleSelectValue, null> & {
      code?: string;
      eta?: string;
    })
  | null;

const SelectCountryForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedEmployees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  );
  const equipFlowStartedRef = useRef(false);

  useEffect(() => {
    if (equipFlowStartedRef.current) return;
    equipFlowStartedRef.current = true;
    trackEquipFlowStarted("equip_employee", selectedEmployees?.length ?? 0);
  }, [selectedEmployees?.length]);

  const [etaText, setEtaText] = useState<string>("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountrySelectValue>(null);
  const { data: getCountries } = useGetCountriesQuery();

  const countries = getCountries?.data?.data;
  const formatCountriesWithETA = useTransformCountriesWithETA(countries);

  const { removeAllItemsFromCart } = useCart();

  const form = useForm<z.infer<typeof selectCountrySchema>>({
    resolver: zodResolver(selectCountrySchema),

    defaultValues: {
      country: {
        label: null,
        value: null,
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof selectCountrySchema>) => {
    const country = {
      id: selectedCountry?.value,
      name: selectedCountry?.label,
      code: selectedCountry?.code,
      eta: selectedCountry?.eta,
    };
    dispatch(setCountry(country));
    dispatch(setSelectedEmployees([]));
    removeAllItemsFromCart();
    router.push(routes.EQUIP_EMPLOYEE_MARKETPLACE);
  };

  const handleOnChange = (value: CountrySelectValue) => {
    if (value?.eta) {
      setEtaText(
        `Estimated time of delivery is between ${value?.eta} working days.`,
      );
    }
  };

  const countryOptions = formatCountriesWithETA.map((item) => ({
    ...item,
    icon: item.code ? (
      <ReactCountryFlag
        countryCode={item.code}
        svg
        title={`${item.label} flag`}
        style={{ width: "18px", height: "18px", borderRadius: "2px" }}
      />
    ) : null,
  }));

  return (
    <div className="mt-2 flex w-full flex-col items-center px-4 sm:px-0">
      <Form {...form}>
        <Card className="w-full max-w-[40rem] rounded-2xl border border-gray-200 bg-white px-0 py-10 shadow-xslg sm:px-8">
          <CardHeader className="flex flex-col items-center justify-center px-6 sm:px-0">
            <Image
              src={group_country_icon}
              alt={"group_country_icon"}
              width={120}
              height={56}
            />
            <CardTitle className="!mt-5 !mb-2 !text-[20px] !leading-7 text-gray-900">
              Select country
            </CardTitle>
            <CardDescription className="my-0 text-center text-sm text-gray-600">
              Select your employee destination country.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-0">
            <form
              className="flex h-full flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="country_id"
                label="Country"
                render={({ field: { onChange, ...restField } }) => (
                  <div className="mt-1">
                    <Autocomplete
                      {...restField}
                      options={countryOptions}
                      setSelectedOption={(value) => {
                        onChange(value);
                        const selectedValue = value as CountrySelectValue;
                        setSelectedCountry(selectedValue);
                        handleOnChange(selectedValue);
                      }}
                      selectedOption={selectedCountry as SingleSelectValue}
                      isSearchable
                      placeholder="Select country"
                      placeholderIcon={<Earth />}
                      isClearable
                      data-testid="selectcountryform-autocomplete"
                    />
                  </div>
                )}
              />

              <p className="my-2 text-sm font-normal text-gray-600">
                {etaText}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  className="w-full text-sm font-semibold"
                  variant="outline"
                  onClick={() => router.push(routes.EQUIP_EMPLOYEE)}
                  data-testid="selectcountryform-button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedCountry}
                  className="w-full text-sm font-semibold"
                  data-testid="selectcountryform-button-2"
                >
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
};

export default SelectCountryForm;
