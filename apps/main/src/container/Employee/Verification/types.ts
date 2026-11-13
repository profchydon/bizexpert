export interface DeliveryInfoForm {
  phone: string;
  country: string;
  state: string;
  address: string;
  landmark: string;
}

export interface CountryOption {
  id: string;
  label: string;
  countryCode: string;
}

export interface SaveOverrideData {
  recipientName?: string;
  phoneNumber?: string;
  country?: string;
  countryCode?: string;
  streetAddress?: string;
  apartmentSuite?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  alternativeContact?: string;
}
