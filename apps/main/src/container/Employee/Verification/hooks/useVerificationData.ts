import { useEffect, useMemo, useState } from "react";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useGetVerificationDataQuery } from "@/api/baseQueries/employeeVerificationApi/getVerificationData";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { buildAddress } from "../utils";
import {
  getActiveVerificationInfo,
  getActiveVerificationNotes,
} from "../verificationInfo";
import type { CountryOption } from "../types";

interface UseVerificationDataProps {
  token: string;
  companyId?: string;
}

const formatEmploymentType = (value?: string | null) => {
  if (!value) return "";
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replaceAll(/\b\w/g, (char) => char.toUpperCase());
};

const useVerificationData = ({
  token,
  companyId,
}: UseVerificationDataProps) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const resolvedCompanyId = companyId || company?.id || "";

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showSavedBanner, setShowSavedBanner] = useState(false);
  const [displayCountry, setDisplayCountry] = useState("United States");
  const [displayCountryCode, setDisplayCountryCode] = useState("US");

  const { data, isLoading, isError, refetch } = useGetVerificationDataQuery(
    { companyId: resolvedCompanyId, token },
    { skip: !token || !resolvedCompanyId },
  );

  const { data: countriesResponse } = useGetCountriesQuery();

  const countryOptions = useMemo<CountryOption[]>(() => {
    return (countriesResponse?.data?.data ?? []).map((item: any) => ({
      id: item.id,
      label: item.name,
      countryCode: (item.code || "").toUpperCase(),
    }));
  }, [countriesResponse]);

  const verificationData = data?.data;

  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartmentSuite, setApartmentSuite] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [signatureRequired, setSignatureRequired] = useState(true);

  useEffect(() => {
    if (!verificationData) return;
    const activeInfo = getActiveVerificationInfo(verificationData);
    if (!activeInfo) return;

    setRecipientName(activeInfo.recipient_name || "");
    setPhoneNumber(activeInfo.phone_number || "");
    setEmailAddress(activeInfo.email || activeInfo.alternative_contact || "");
    setEmployeeType(formatEmploymentType(activeInfo.employment_type));
    setStreetAddress(activeInfo.street_address || "");
    setApartmentSuite(activeInfo.apartment_suite || "");
    setCity(activeInfo.city || "");
    setState(activeInfo.state || "");
    setZipCode(activeInfo.zip_code || "");
    setDeliveryNotes(getActiveVerificationNotes(verificationData));
    setSignatureRequired(Boolean(verificationData.signature_required));

    const countryFromApi = activeInfo.country || "";
    const countryCodeFromApi = activeInfo.country_code || "";

    if (countryFromApi) {
      const matchedByName = countryOptions.find(
        (item) => item.label.toLowerCase() === countryFromApi.toLowerCase(),
      );
      setDisplayCountry(matchedByName?.label || countryFromApi);
      setDisplayCountryCode(
        matchedByName?.countryCode || countryCodeFromApi || displayCountryCode,
      );
      return;
    }

    if (countryCodeFromApi) {
      const matched = countryOptions.find(
        (item) =>
          item.countryCode.toLowerCase() === countryCodeFromApi.toLowerCase(),
      );

      if (matched) {
        setDisplayCountry(matched.label);
        setDisplayCountryCode(matched.countryCode);
      }
    }
  }, [countryOptions, displayCountryCode, verificationData]);

  const fullAddress = useMemo(
    () => buildAddress(streetAddress, apartmentSuite, city, state, zipCode),
    [streetAddress, apartmentSuite, city, state, zipCode],
  );

  const equipmentItems = useMemo(() => {
    const equipmentDetails = verificationData?.order_equipment_details;
    const normalizeImageUrl = (value?: string | string[] | null) => {
      if (!value) return "";
      if (Array.isArray(value)) return value[0] || "";
      return value;
    };

    if (equipmentDetails) {
      const assetOrders = (equipmentDetails.asset_orders || []).map((item) => ({
        id: `asset-${item.sub_order_id}`,
        name: item.asset?.name || item.equipment?.title || "Unknown equipment",
        quantity: Number(item.quantity || 1),
        imageUrl: normalizeImageUrl(
          item.asset?.images || item.equipment?.images,
        ),
      }));

      const storageToEmployeeOrders = (
        equipmentDetails.storage_to_employee_orders || []
      ).map((item) => ({
        id: `storage-${item.sub_order_id}`,
        name: item.asset?.name || item.equipment?.title || "Unknown equipment",
        quantity: Number(item.quantity || 1),
        imageUrl: normalizeImageUrl(
          item.asset?.images || item.equipment?.images,
        ),
      }));

      const offboardingOrders = (equipmentDetails.offboarding_orders || []).map(
        (item) => ({
          id: `offboarding-${item.sub_order_id}`,
          name:
            item.asset?.name || item.equipment?.title || "Unknown equipment",
          quantity: Number(item.quantity || 1),
          imageUrl: normalizeImageUrl(
            item.asset?.images || item.equipment?.images,
          ),
        }),
      );

      return [...assetOrders, ...storageToEmployeeOrders, ...offboardingOrders];
    }

    return (verificationData?.items || []).map((item, idx) => ({
      id: `legacy-item-${idx + 1}`,
      name: item.name,
      quantity: item.quantity,
      imageUrl: "",
    }));
  }, [verificationData]);

  const selectedCountryId =
    countryOptions.find(
      (item) => item.label.toLowerCase() === displayCountry.toLowerCase(),
    )?.id || "";

  const canEditDelivery = Boolean(
    verificationData?.can_edit &&
    (verificationData?.can_update_details ?? true),
  );

  return {
    resolvedCompanyId,
    isLoading,
    isError,
    refetch,
    countryOptions,
    verificationData,
    termsAccepted,
    setTermsAccepted,
    isEditOpen,
    setIsEditOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    showSavedBanner,
    setShowSavedBanner,
    displayCountry,
    setDisplayCountry,
    displayCountryCode,
    setDisplayCountryCode,
    recipientName,
    setRecipientName,
    phoneNumber,
    setPhoneNumber,
    emailAddress,
    setEmailAddress,
    employeeType,
    setEmployeeType,
    streetAddress,
    setStreetAddress,
    apartmentSuite,
    setApartmentSuite,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    deliveryNotes,
    setDeliveryNotes,
    signatureRequired,
    setSignatureRequired,
    fullAddress,
    equipmentItems,
    selectedCountryId,
    canEditDelivery,
  };
};

export default useVerificationData;
