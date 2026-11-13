"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditEquipmentMutation } from "@/api/baseQueries/companiesApi/equipmentsApi/editEquipment";
import { useGetSingleEquipmentQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getSingleEquipment";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { buildEmployeeCountrySelectItems } from "@/container/Dashboard/Employees/EmployeeDetails/buildEmployeeCountrySelectItems";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";
import { formatScientificNotation } from "@/utils/formatScientificNotation";
import { useGetOfficesQuery } from "@/api/baseQueries/companiesApi/officesApi/getOffices";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useWorkspaceEquipmentDefaults } from "@/hooks/useWorkspaceEquipmentDefaults";
import {
  buildEquipmentOfficeItems,
  OFFICE_OPTIONS_PER_PAGE,
  selectOfficesForCompany,
} from "./AddEquipment/equipmentOfficeOptions";
import {
  buildWorkspaceCurrencyItems,
  buildWorkspaceOverrideHint,
  hasWorkspaceOverride,
} from "./workspaceEquipmentDefaults";
import { addSingleEquipmentSchema } from "./AddEquipment/SingleEquipment/validation";
import { canSaveEditEquipment } from "./editSingleEquipmentForm";
import {
  buildEditEquipmentPayload,
  mapEquipmentToEditForm,
} from "./submitSingleEquipmentEdit";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

export function useSingleEquipmentEditForm(
  equipmentId: string,
  onClose: () => void,
) {
  const companyId = useWorkspaceCompanyId();
  const [images, setImages] = useState<File[] | string[]>([]);
  const [editEquipment, { isLoading: isSaving }] = useEditEquipmentMutation();

  const workspaceCompanyId = companyId;
  const { currencyCode, currencyId } = useWorkspaceEquipmentDefaults();

  const { data: getCountries } = useGetCountriesQuery();
  const countries = getCountries?.data?.data;

  const { data: getOffices } = useGetOfficesQuery(
    {
      companyId: companyId!,
      params: { per_page: OFFICE_OPTIONS_PER_PAGE },
    },
    { skip: !companyId },
  );

  const { data: getSingleEmployee, isLoading } = useGetSingleEquipmentQuery(
    { companyId: companyId!, equipmentId },
    { skip: !companyId || !equipmentId },
  );

  const equipment = getSingleEmployee?.data;

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
      properties: [],
      purchase_date: "",
      purchase_price: "",
      currency_id: "",
      description: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!equipment) return;
    form.reset({
      ...mapEquipmentToEditForm(equipment, countries),
      ...(currencyId ? { currency_id: currencyId } : {}),
    });
    if (equipment.image_url) setImages([equipment.image_url]);
    if (equipment.purchase_price) {
      form.setValue(
        "purchase_price",
        formatScientificNotation(equipment.purchase_price),
      );
    }
  }, [equipment, countries, form, currencyId]);

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

  const savedCurrencyCode = equipment?.currency?.code ?? "";

  const currencyHint = hasWorkspaceOverride(savedCurrencyCode, currencyCode)
    ? buildWorkspaceOverrideHint("currency", savedCurrencyCode)
    : undefined;

  const watched = form.watch();
  const canSave = canSaveEditEquipment(
    watched.title,
    watched.type,
    watched.state,
    isSaving,
    isLoading,
    String(watched.purchase_date ?? ""),
  );

  const save = async () => {
    const valid = await form.trigger();
    if (!valid || !companyId || !equipmentId) return;

    const data = form.getValues();
    const imageFile = images[0] as Blob | string | undefined;
    const payload = buildEditEquipmentPayload(
      companyId,
      equipmentId,
      data,
      imageFile,
    );

    try {
      await editEquipment(payload).unwrap();
      displaySuccessMessage(
        "Equipment updated successfully",
        "The equipment has been updated in the company roster.",
      );
      form.reset();
      setImages([]);
      onClose();
    } catch (error) {
      showApiError(error);
    }
  };

  return {
    form,
    save,
    images,
    setImages,
    isLoading,
    isSaving,
    canSave,
    countryItems,
    currencyItems,
    officeItems,
    currencyHint,
    isCurrencyLocked: Boolean(currencyId),
  };
}
