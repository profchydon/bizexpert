"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateEquipmentMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/createEquipment";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useGetOfficesQuery } from "@/api/baseQueries/companiesApi/officesApi/getOffices";
import { buildEmployeeCountrySelectItems } from "@/container/Dashboard/Employees/EmployeeDetails/buildEmployeeCountrySelectItems";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import {
  buildCreateEquipmentPayload,
  canSaveAddEquipment,
} from "./submitSingleEquipmentCreate";
import {
  applyWorkspaceCountryDefault,
  buildWorkspaceCurrencyItems,
} from "../workspaceEquipmentDefaults";
import { useWorkspaceEquipmentDefaults } from "@/hooks/useWorkspaceEquipmentDefaults";
import {
  buildEquipmentOfficeItems,
  OFFICE_OPTIONS_PER_PAGE,
  selectOfficesForCompany,
} from "./equipmentOfficeOptions";
import { addSingleEquipmentSchema } from "./SingleEquipment/validation";
import { useEquipmentAssigneeOptions } from "./useEquipmentAssigneeOptions";
import { shouldClearAssignee } from "./equipmentAssigneeByCountry";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

export function useSingleEquipmentAddForm(onClose: () => void) {
  const { push } = useTransitionRouter();
  const companyId = useWorkspaceCompanyId();
  const workspaceCompanyId = companyId;
  const [images, setImages] = useState<File[] | string[]>([]);
  const [createEquipment, { isLoading: isSaving }] =
    useCreateEquipmentMutation();

  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;

  const { countryName, currencyCode, currencyId } =
    useWorkspaceEquipmentDefaults();

  const { data: getOffices } = useGetOfficesQuery(
    {
      companyId: companyId!,
      params: { per_page: OFFICE_OPTIONS_PER_PAGE },
    },
    { skip: !companyId },
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(addSingleEquipmentSchema),
    defaultValues: {
      title: "",
      serial_number: "",
      make: "",
      model: "",
      year: "",
      type: "",
      state: "",
      country: "",
      status: "unassigned",
      assignee: "",
      office_id: "",
      properties: [],
      purchase_date: "",
      purchase_price: "",
      currency_id: "",
      description: "",
    },
    mode: "onChange",
  });

  const countryItems = useMemo(
    () => buildEmployeeCountrySelectItems(countries ?? []),
    [countries],
  );

  const currencyItems = useMemo(
    () => buildWorkspaceCurrencyItems(currencyId, currencyCode),
    [currencyId, currencyCode],
  );

  const officeItems = useMemo(
    () =>
      buildEquipmentOfficeItems(
        selectOfficesForCompany(getOffices?.data?.data, workspaceCompanyId),
      ),
    [getOffices, workspaceCompanyId],
  );

  useEffect(() => {
    if (currencyId) form.setValue("currency_id", currencyId);
  }, [currencyId, form]);

  useEffect(() => {
    const nextCountry = applyWorkspaceCountryDefault(
      form.getValues("country"),
      countryName,
    );
    if (!nextCountry || nextCountry === form.getValues("country")) return;
    form.setValue("country", nextCountry);
  }, [countryName, form]);

  useEffect(() => {
    if (officeItems.length !== 1 || form.getValues("office_id")) return;
    form.setValue("office_id", officeItems[0].id);
  }, [officeItems, form]);

  const watched = form.watch();
  const { employeeOptions, isEmployeesReady } = useEquipmentAssigneeOptions(
    companyId,
    String(watched.country ?? ""),
    countries,
  );

  useEffect(() => {
    if (
      !shouldClearAssignee(
        String(form.getValues("assignee") ?? ""),
        employeeOptions.map((option) => option.value),
        isEmployeesReady,
      )
    ) {
      return;
    }
    form.setValue("assignee", "");
  }, [employeeOptions, form, isEmployeesReady]);

  const canSave = canSaveAddEquipment(
    watched.title,
    watched.type,
    watched.state,
    String(watched.status ?? ""),
    String(watched.assignee ?? ""),
    isSaving,
    String(watched.purchase_date ?? ""),
  );

  const save = async () => {
    const valid = await form.trigger();
    if (!valid || !companyId) return;

    const data = form.getValues();
    const imageFile = images[0] as Blob | string | undefined;
    const payload = buildCreateEquipmentPayload(companyId, data, imageFile);

    try {
      await createEquipment(payload).unwrap();

      displaySuccessMessage(
        "Equipment added successfully",
        "New equipment has been added to the company roster.",
      );
      form.reset();
      setImages([]);
      onClose();
      push("/dashboard/all-equipments");
    } catch (error) {
      showApiError(error);
    }
  };

  return {
    form,
    save,
    images,
    setImages,
    isSaving,
    canSave,
    countryItems,
    currencyItems,
    officeItems,
    employeeOptions,
    isCurrencyLocked: Boolean(currencyId),
  };
}
