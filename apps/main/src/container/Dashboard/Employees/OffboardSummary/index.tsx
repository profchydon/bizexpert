"use client";

import React, { useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch, useAppSelector } from "@/store";
import { setOffboardingData } from "@/store/slices/offboardingSlice";
import { Button } from "@/components/ui/button";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import { buildAssetTypeMix } from "@/lib/offboardAnalytics";
import ServiceFeeBreakdown from "../OffboardDevices/ServiceFeeBreakdown";
import { useTrackOffboardFeeShown } from "../OffboardDevices/useTrackOffboardFeeShown";
import OffboardSummaryHeader from "./OffboardSummaryHeader";
import OffboardSummaryEmployeeCard from "./OffboardSummaryEmployeeCard";
import { buildOffboardAssets } from "./buildOffboardAssets";
import { useOffboardReviewFees } from "./useOffboardReviewFees";

const OffboardSummary = () => {
  const { push, replace, isPending: isNavigatePending } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const review = useAppSelector(
    (state) => state.persistedReducers.employee?.offboardReview,
  );
  const offboardEmployees = useAppSelector(
    (state) => state.persistedReducers.employee?.offboardEmployees,
  );
  const count = review?.length ?? 0;
  const { data: assetTypesRes } = useGetAssetTypesQuery();
  const { breakdown, isLoading: isFeesLoading } = useOffboardReviewFees(
    review ?? [],
  );
  const assetTypeMix = useMemo(() => {
    const devices = (review ?? []).flatMap((employee) => employee.devices);
    return buildAssetTypeMix(devices, assetTypesRes?.data);
  }, [assetTypesRes?.data, review]);

  useTrackOffboardFeeShown(breakdown, assetTypeMix, isFeesLoading);

  useEffect(() => {
    if (count === 0) replace(routes.EMPLOYEES);
  }, [count, replace]);

  if (count === 0 || !review) return null;

  const handleCheckout = () => {
    const assets = buildOffboardAssets(review, offboardEmployees ?? []);
    if (assets.length === 0) return;
    dispatch(setOffboardingData(assets));
    push(`${routes.OFFBOARDING}/order-summary?isEmployeeOffboarding=true`);
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <OffboardSummaryHeader employeeCount={count} />

      <div className="flex flex-col gap-5">
        {review.map((employee) => (
          <OffboardSummaryEmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={() =>
              push(
                `${routes.EMPLOYEES_OFFBOARD_DEVICES}?employeeId=${employee.id}`,
              )
            }
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <ServiceFeeBreakdown breakdown={breakdown} isLoading={isFeesLoading} />

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-11 px-5 text-sm font-semibold text-gray-700"
            onClick={() => push(routes.EMPLOYEES_OFFBOARD_DEVICES)}
            isLoading={isNavigatePending}
            data-testid="offboardsummary-button"
          >
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            className="h-11 gap-2 px-5 text-sm font-semibold"
            onClick={handleCheckout}
            isLoading={isNavigatePending}
            data-testid="offboardsummary-button-2"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OffboardSummary;
