"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useGetCurrenciesQuery } from "@/api/baseQueries/currenciesApi/getCurrencies";
import { buildEmployeeCountrySelectItems } from "@/container/Dashboard/Employees/EmployeeDetails/buildEmployeeCountrySelectItems";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAppDispatch, useAppSelector } from "@/store";
import { setImportedEquipment } from "@/store/slices/equipmentSlice";
import type { IAddEquipment } from "@/types/equipments";
import { getImageUrl } from "@/utils/imageToURL";
import {
  canSaveEditImportedEquipment,
  mapFormToImportedEquipment,
  mapImportedEquipmentToForm,
} from "./mapImportedEquipmentToForm";
import { editImportedEquipmentSchema } from "./validation";
import { useEquipmentAssigneeOptions } from "../../useEquipmentAssigneeOptions";
import { shouldClearAssignee } from "../../equipmentAssigneeByCountry";

type FormValues = z.infer<typeof editImportedEquipmentSchema>;

export function useEditImportedEquipmentForm(
  equipmentId: string,
  onBack: () => void,
) {
  const dispatch = useAppDispatch();
  const companyId = useWorkspaceCompanyId();
  const [images, setImages] = useState<File[] | string[]>([]);

  const equipmentData =
    (useAppSelector(
      (state) => state.persistedReducers.equipment?.importedEquipment,
    ) as IAddEquipment[]) || [];

  const equipment = equipmentData.find(
    (item) => String(item.id) === String(equipmentId),
  );

  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;
  const { data: getCurrencies } = useGetCurrenciesQuery();
  const currenciesData = getCurrencies?.data;

  const form = useForm<FormValues>({
    resolver: zodResolver(editImportedEquipmentSchema),
    defaultValues: mapImportedEquipmentToForm({} as IAddEquipment),
    mode: "onChange",
  });

  useEffect(() => {
    if (!equipment) return;
    form.reset(mapImportedEquipmentToForm(equipment));
    if (equipment.imageUrl) setImages([equipment.imageUrl]);
  }, [equipment, form]);

  const countryItems = useMemo(
    () => buildEmployeeCountrySelectItems(countries ?? []),
    [countries],
  );

  const currencyItems = useMemo(
    () =>
      (currenciesData ?? []).map((currency: { id: string; code: string }) => ({
        id: currency.id,
        label: currency.code,
      })),
    [currenciesData],
  );

  const watched = form.watch();
  const { employeeOptions, isEmployeesReady } = useEquipmentAssigneeOptions(
    companyId,
    String(watched.country ?? ""),
    countries,
  );

  useEffect(() => {
    const assignee = String(form.getValues("assignee") ?? "");
    if (
      !shouldClearAssignee(
        assignee,
        employeeOptions.map((option) => option.value),
        isEmployeesReady,
      )
    ) {
      return;
    }
    form.setValue("assignee", "");
  }, [employeeOptions, form, isEmployeesReady]);

  const canSave = canSaveEditImportedEquipment(
    watched.title,
    watched.type,
    watched.state,
    watched.purchase_price,
    watched.currency_id,
    String(watched.status ?? ""),
    String(watched.assignee ?? ""),
  );

  const save = async () => {
    const valid = await form.trigger();
    if (!valid || !equipment) return;

    const data = form.getValues();
    const imageFile = images[0];
    const updated = mapFormToImportedEquipment(
      equipment,
      data,
      imageFile instanceof File
        ? getImageUrl(imageFile)
        : typeof imageFile === "string"
          ? imageFile
          : equipment.imageUrl,
    );

    const nextRows = equipmentData
      .filter((item) => String(item.id) !== String(equipmentId))
      .concat(updated)
      .sort((a, b) => Number(a.id) - Number(b.id));

    dispatch(setImportedEquipment(nextRows));
    onBack();
  };

  return {
    form,
    save,
    images,
    setImages,
    canSave,
    countryItems,
    currencyItems,
    employeeOptions,
    equipment,
  };
}
