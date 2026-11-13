"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { FC, useEffect } from "react";
import routes from "@/routes";
import OptionCard from "./OptionCard";
import PageState from "@/components/PageState";
import { useSearchParams } from "next/navigation";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useGetServiceCountryQuery } from "@/api/baseQueries/servicesApi/getServiceInCountry";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import {
  offboarding_device,
  onboard_device,
  contracts,
  storage_option,
  internet_contract,
} from "@/assets/images";
import { useAppDispatch } from "@/store";
import { setCountry } from "@/store/slices/equipEmployeeSlice";

const ServiceOptions = () => {
  const { push, isPending } = useTransitionRouter();
  const searchParams = useSearchParams();
  const countryId = searchParams.get("countryId") as string;

  const services = [
    {
      slug: "onboarding",
      icon: onboard_device,
      route: routes.EQUIP_EMPLOYEE_MARKETPLACE,
      link: "",
    },
    {
      slug: "storage",
      icon: storage_option,
      route: `${routes.STORAGE}/${countryId}`,
      link: "",
    },
    {
      slug: "offboarding",
      icon: offboarding_device,
      route: routes.OFFBOARDING,
      link: "",
    },
    {
      slug: "service_contract",
      icon: contracts,
      link: "",
    },
    {
      slug: "internet_contract",
      icon: internet_contract,
      link: "",
    },
  ];

  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;

  const selectedCountry = countries?.find(
    (country: any) => country.id === countryId,
  );

  const countryName = selectedCountry?.name;
  const countryCode = selectedCountry?.code;

  const {
    data: getServiceCountry,
    isLoading: serviceCountryLoading,
    isError: serviceCountryError,
  } = useGetServiceCountryQuery(
    { countryId: countryId! },
    { skip: !countryId },
  );

  const getServiceInCountry = getServiceCountry?.data?.services;

  const transformServiceData = getServiceInCountry?.map((item) => {
    const matchedSlug = services.find(
      (serviceItem) => serviceItem.slug === item.slug,
    );

    const matchedLink = services.find(
      (serviceLink) => serviceLink.link === item.link,
    );

    return {
      ...item,
      icon: matchedSlug?.icon ?? contracts,
      link: matchedSlug?.route ?? matchedLink?.link,
    };
  });

  return (
    <PageState isLoading={serviceCountryLoading} isError={serviceCountryError}>
      <div className="flex flex-col gap-y-8 bg-[#FAFAFA] w-full p-12">
        <div className="flex flex-row w-full justify-between ">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-gray-900 text-xl font-semibold">
              What would you like to do today?
            </h3>
            <span className="text-gray-600 text-sm">
              Select an option to manage equipment and employee resources in{" "}
              {countryName ?? "your selected country"}.{" "}
            </span>
          </div>
          <div className="justify-self-end self-end">
            <Button
              variant="outline"
              className=""
              isLoading={isPending}
              onClick={() => push(`${routes.OVERVIEW}`)}
              data-testid="servicesoptions-button"
            >
              <ArrowLeft /> Go Back
            </Button>
          </div>
        </div>
        {transformServiceData && transformServiceData.length > 0 ? (
          transformServiceData?.map((item) => (
            <OptionCard
              key={item.id}
              icon={item?.icon}
              name={item.name}
              description={item.description}
              link={item?.link}
              status={item?.status}
              slug={item?.slug}
              country_id={countryId}
              country_name={countryName}
              country_code={countryCode}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg">
              No service available in this country
            </p>
          </div>
        )}
      </div>
    </PageState>
  );
};

export default ServiceOptions;
