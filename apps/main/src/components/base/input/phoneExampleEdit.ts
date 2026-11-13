const PHONE_EXAMPLE_NATIONAL = "(555) 000-0000";

export function phoneExampleValue(dialCode: string) {
  const code = dialCode.trim();
  return code ? `${code} ${PHONE_EXAMPLE_NATIONAL}` : PHONE_EXAMPLE_NATIONAL;
}

export function nextPhoneAfterExampleEdit(input: string, example: string) {
  if (input === example) {
    return { phone: "", dismissed: false };
  }

  const exampleDigits = example.replace(/\D/g, "");
  const digits = input.replace(/\D/g, "");

  if (input === "" || example.startsWith(input) || digits === exampleDigits) {
    return { phone: "", dismissed: true };
  }

  if (digits.startsWith(exampleDigits)) {
    return {
      phone: digits.slice(exampleDigits.length),
      dismissed: true,
    };
  }

  return { phone: digits, dismissed: true };
}
