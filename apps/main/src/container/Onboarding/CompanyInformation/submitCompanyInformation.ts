import type { ICompany } from "@/types/auth";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { showApiError } from "@/utils/showApiError";

type CompanyLocation = {
  state?: string;
  lat?: number;
  lng?: number;
  currencyCode?: string;
};

type CompanyDraft = {
  name?: string | null;
  email?: string | null;
  size?: string | null;
};

export const buildCompanyInformationPayload = (
  company: CompanyDraft | undefined,
  data: { country: string; address: string; business_website?: string },
  countryLabel: string,
  address?: CompanyLocation,
) => ({
  name: company?.name,
  email: company?.email,
  size: company?.size,
  industry: "-",
  country: countryLabel,
  state: address?.state,
  latitude: address?.lat?.toString(),
  longitude: address?.lng?.toString(),
  billing_currency: address?.currencyCode === "NGN" ? "NGN" : "USD",
  address: data.address,
  website: data?.business_website,
  stage: "Completed",
});

export const submitCompanyInformation = async ({
  updateCompany,
  companyId,
  payload,
  onContinue,
}: {
  updateCompany: (request: {
    companyId: string;
    company: Partial<ICompany>;
  }) => { unwrap: () => Promise<unknown> };
  companyId: string;
  payload: ReturnType<typeof buildCompanyInformationPayload>;
  onContinue: () => void;
}) => {
  try {
    await updateCompany({
      companyId,
      company: payload as unknown as Partial<ICompany>,
    }).unwrap();
    displaySuccessMessage("Company information updated");
    onContinue();
  } catch (error) {
    showApiError(error);
  }
};
