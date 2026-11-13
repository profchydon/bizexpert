"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  trackEquipFlowStarted,
  trackOrderCancelled,
} from "@/lib/orderFlowAnalytics";
import { useSearchParams } from "next/navigation";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addEquipEmployees,
  removeEquipEmployee,
  setEquipReview,
} from "@/store/slices/employeeSlice";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import EmployeeSwitcherStrip, {
  toBasicEmployees,
} from "../OffboardDevices/EmployeeSwitcherStrip";
import OnboardDevicesHeader from "./OnboardDevicesHeader";
import DeviceSelectionEmpty from "./DeviceSelectionEmpty";
import SelectedDevicesCard from "./SelectedDevicesCard";
import RunningTotal from "./RunningTotal";
import OnboardDevicesFooter from "./OnboardDevicesFooter";
import OnboardDeviceModals from "./OnboardDeviceModals";
import { useEquipDevicesState } from "./useEquipDevicesState";
import { usePolicyPrefill } from "./usePolicyPrefill";
import { buildEquipReview, reviewToItemsMap } from "./buildEquipReview";
import { useEquipDisplayCurrency } from "./useEquipDisplayCurrency";
import {
  resolveEmployeeCountryId,
  type CountryOption,
} from "./resolveEmployeeCountryId";

const OnboardDevices = () => {
  const { push, replace, isPending: isNavigatePending } = useTransitionRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const equipEmployees = useAppSelector(
    (state) => state.persistedReducers.employee?.equipEmployees,
  );
  const equipReview = useAppSelector(
    (state) => state.persistedReducers.employee?.equipReview,
  );

  const [currentIndex, setCurrentIndex] = useState(() => {
    const focusId = searchParams.get("employeeId");
    if (!focusId) return 0;
    const index = (equipEmployees ?? []).findIndex(
      (employee) => String(employee.id) === focusId,
    );
    return index >= 0 ? index : 0;
  });
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

  const count = equipEmployees?.length ?? 0;
  const equipFlowStartedRef = useRef(false);

  useEffect(() => {
    if (equipFlowStartedRef.current || count === 0) return;
    equipFlowStartedRef.current = true;
    trackEquipFlowStarted("onboard_devices", count);
  }, [count]);

  useEffect(() => {
    if (count === 0) replace(routes.EMPLOYEES);
  }, [count, replace]);

  const employees = useMemo(
    () => toBasicEmployees(equipEmployees),
    [equipEmployees],
  );

  const { data: countriesRes } = useGetCountriesQuery();
  const countries = useMemo<CountryOption[]>(
    () => countriesRes?.data?.data ?? countriesRes?.data ?? [],
    [countriesRes],
  );

  const initialItems = useMemo(
    () => reviewToItemsMap(equipReview),
    [equipReview],
  );
  const devices = useEquipDevicesState(initialItems);
  const currentId = employees[currentIndex]?.id;
  const displayCurrency = useEquipDisplayCurrency(
    currentId ? devices.getItems(currentId) : [],
  );
  usePolicyPrefill(currentId, devices.prefillDevices);

  const currentCountryId = useMemo(() => {
    const fullEmployee = equipEmployees?.find(
      (employee) => String(employee.id) === currentId,
    );
    return resolveEmployeeCountryId(fullEmployee, countries);
  }, [equipEmployees, currentId, countries]);

  const abandonEquipFlow = () => {
    trackOrderCancelled({
      order_flow: "equip_employee",
      step_abandoned: "device_selection",
    });
    push(routes.EMPLOYEES);
  };

  const handleRemoveById = (id: string) => {
    if (count <= 1) {
      abandonEquipFlow();
      return;
    }
    const removingIndex = employees.findIndex((employee) => employee.id === id);
    if (removingIndex === -1) return;
    setCurrentIndex((index) => {
      if (removingIndex < index) return index - 1;
      if (removingIndex === index) return Math.min(index, count - 2);
      return index;
    });
    devices.clearDevices(id);
    dispatch(removeEquipEmployee(id));
  };

  if (count === 0 || !currentId) return null;

  const current = employees[currentIndex];
  const items = devices.getItems(currentId);
  const employeeIds = employees.map((employee) => employee.id);
  const multi = count > 1;
  const canProceed = employees.every(
    (employee) => devices.getItems(employee.id).length > 0,
  );
  const proceedDisabledReason = canProceed
    ? undefined
    : `Add at least one device ${multi ? "for every employee " : ""}to continue.`;
  const goPrev = () => setCurrentIndex((index) => Math.max(0, index - 1));
  const goNext = () =>
    setCurrentIndex((index) => Math.min(count - 1, index + 1));

  const handleProceed = () => {
    if (!canProceed) return;
    dispatch(setEquipReview(buildEquipReview(employees, devices.getItems)));
    push(routes.EMPLOYEES_ONBOARD_SUMMARY);
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <OnboardDevicesHeader employeeName={current.name} />

      <EmployeeSwitcherStrip
        employees={employees}
        currentIndex={currentIndex}
        onSwitch={setCurrentIndex}
        onPrev={goPrev}
        onNext={goNext}
        onAdd={() => setIsAddEmployeeOpen(true)}
        onRemoveEmployee={handleRemoveById}
      />

      {items.length === 0 ? (
        <DeviceSelectionEmpty onAddDevice={() => setIsAddDeviceOpen(true)} />
      ) : (
        <>
          <SelectedDevicesCard
            items={items}
            onAddDevice={() => setIsAddDeviceOpen(true)}
            onClearAll={() => devices.clearDevices(currentId)}
            onRemove={(lineId) => devices.removeDevice(currentId, lineId)}
            onQuantityChange={(lineId, qty) =>
              devices.changeQuantity(currentId, lineId, qty)
            }
            onConfigChange={(lineId, config) =>
              devices.changeConfig(currentId, lineId, config)
            }
            onFulfilmentDateChange={(lineId, fulfilmentDate) =>
              devices.changeFulfilmentDate(currentId, lineId, fulfilmentDate)
            }
          />
          <RunningTotal items={items} currency={displayCurrency} />
        </>
      )}

      <OnboardDevicesFooter
        multi={multi}
        isFirst={currentIndex === 0}
        isLast={currentIndex === count - 1}
        canProceed={canProceed}
        proceedDisabledReason={proceedDisabledReason}
        onCancel={abandonEquipFlow}
        onPrevious={goPrev}
        onNext={goNext}
        onProceed={handleProceed}
        isCancelLoading={isNavigatePending}
        isProceedLoading={isNavigatePending}
      />

      <OnboardDeviceModals
        isAddEmployeeOpen={isAddEmployeeOpen}
        onAddEmployeeOpenChange={setIsAddEmployeeOpen}
        excludeIds={employeeIds}
        onAddEmployees={(added) => dispatch(addEquipEmployees(added))}
        isAddDeviceOpen={isAddDeviceOpen}
        onAddDeviceOpenChange={setIsAddDeviceOpen}
        employee={current}
        countryId={currentCountryId}
        currency={displayCurrency}
        addedAssetIds={new Set(items.map((item) => item.lineId))}
        unavailableStorageIds={devices.claimedStorageIds(
          currentId,
          employeeIds,
        )}
        onAddDevice={(item) => devices.addDevice(currentId, item)}
      />
    </div>
  );
};

export default OnboardDevices;
