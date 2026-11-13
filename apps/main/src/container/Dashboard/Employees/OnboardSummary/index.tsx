"use client";

import React, { useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import useEquipEmployeeFees from "@/hooks/useEquipEmployeeFees";
import { Button } from "@/components/ui/button";
import { calculateRunningTotal } from "../OnboardDevices/equipItems";
import { useEquipDisplayCurrency } from "../OnboardDevices/useEquipDisplayCurrency";
import { type CountryOption } from "../OnboardDevices/resolveEmployeeCountryId";
import { buildEquipCheckout } from "../OnboardDevices/buildEquipCheckout";
import OnboardSummaryHeader from "./OnboardSummaryHeader";
import OnboardSummaryEmployeeCard from "./OnboardSummaryEmployeeCard";
import OnboardSummaryFees from "./OnboardSummaryFees";

const OnboardSummary = () => {
  const { push, replace, isPending: isNavigatePending } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const review = useAppSelector(
    (state) => state.persistedReducers.employee?.equipReview,
  );
  const equipEmployees = useAppSelector(
    (state) => state.persistedReducers.employee?.equipEmployees,
  );
  const { data: countriesRes } = useGetCountriesQuery();
  const countries = useMemo<CountryOption[]>(
    () => countriesRes?.data?.data ?? countriesRes?.data ?? [],
    [countriesRes],
  );

  const checkoutEmployees = useMemo(
    () => buildEquipCheckout(review ?? [], equipEmployees, countries),
    [review, equipEmployees, countries],
  );

  const {
    totalFeesArray,
    totalFeesSummary,
    isLoading: isFeesLoading,
    isError: isFeesError,
  } = useEquipEmployeeFees({
    review,
    equipEmployees,
    countries,
    paymentMethod: "Credit",
  });

  const count = review?.length ?? 0;
  const allItems = (review ?? []).flatMap((employee) => employee.devices);
  const currency = useEquipDisplayCurrency(allItems);

  useEffect(() => {
    if (count === 0) replace(routes.EMPLOYEES);
  }, [count, replace]);

  if (count === 0 || !review) return null;

  const { total, hasPending } = calculateRunningTotal(allItems);

  const handleCheckout = () => {
    if (checkoutEmployees.length === 0) {
      toast("Couldn't start checkout", {
        description: "Re-add the devices for this order and try again.",
      });
      return;
    }

    dispatch(setSelectedEmployees(checkoutEmployees));
    push(`${routes.EQUIP_EMPLOYEE_ORDER_SUMMARY}?flow=equip-employee`);
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <OnboardSummaryHeader employeeCount={count} />

      <div className="flex flex-col gap-5">
        {review.map((employee) => (
          <OnboardSummaryEmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={() =>
              push(
                `${routes.EMPLOYEES_ONBOARD_DEVICES}?employeeId=${employee.id}`,
              )
            }
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <OnboardSummaryFees
          grandTotal={total}
          currency={currency}
          hasPending={hasPending}
          totalFeesArray={totalFeesArray}
          totalFeesSummary={totalFeesSummary}
          totalFee={totalFeesSummary?.total_fee}
          currencySymbol={totalFeesSummary?.currency?.symbol}
          isLoading={isFeesLoading}
          isError={isFeesError}
        />

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-11 px-5 text-sm font-semibold text-gray-700"
            onClick={() => push(routes.EMPLOYEES_ONBOARD_DEVICES)}
            isLoading={isNavigatePending}
            data-testid="onboardsummary-button"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            className="h-11 gap-2 px-5 text-sm font-semibold"
            onClick={handleCheckout}
            isLoading={isNavigatePending}
            data-testid="onboardsummary-button-2"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardSummary;
