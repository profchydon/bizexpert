import type { EditEmployeeFormValues } from "@/container/Dashboard/Employees/EmployeeDetails/buildEditEmployeeFormData";
import { normalizeEmployeePhoneValue } from "@/utils/phone/parseEmployeePhone";
import { isValidPhoneNumber } from "react-phone-number-input";
import { addEmployeeSchema } from "./AddEmployee/validation";

export function canSaveAddEmployee(
  values: EditEmployeeFormValues,
  companyId?: string,
): boolean {
  if (!companyId) return false;
  return addEmployeeSchema.safeParse(values).success;
}

export function getAddEmployeeSaveDisabledReason(
  values: EditEmployeeFormValues,
  companyId?: string,
  isSubmitting = false,
): string | null {
  if (isSubmitting) return "Adding employee.";
  if (!companyId) {
    return "Company workspace is not available. Refresh and try again.";
  }

  const firstName = values.first_name?.trim() ?? "";
  if (firstName.length < 2) {
    return "Enter a first name with at least 2 characters.";
  }

  const lastName = values.last_name?.trim() ?? "";
  if (lastName.length < 2) {
    return "Enter a last name with at least 2 characters.";
  }

  const email = values.email?.trim() ?? "";
  if (email.length < 2) {
    return "Enter a work email.";
  }

  const countryId = values.country_id?.trim() ?? "";
  if (countryId.length < 2) {
    return "Select a country.";
  }

  const phone = normalizeEmployeePhoneValue(values.phone);
  if (phone && !isValidPhoneNumber(phone)) {
    return "Enter a valid phone number.";
  }

  const address = values.address?.trim() ?? "";
  if (address.length > 0 && address.length < 2) {
    return "Enter a valid address.";
  }

  const result = addEmployeeSchema.safeParse(values);
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Complete the required fields.";
  }

  return null;
}
