type DeviceRefreshServicePayload = {
  offboarding?: Record<string, unknown>;
  onboarding?: Record<string, unknown>;
  onboarding_from_storage?: Record<string, unknown>;
};

export const buildDeviceRefreshFeePayload = ({
  companyId,
  paymentMethod,
  companyCountryId,
  transformTogetFees,
}: {
  companyId: string;
  paymentMethod: string;
  companyCountryId: string;
  transformTogetFees: DeviceRefreshServicePayload;
}) => ({
  companyId,
  payment_method: paymentMethod,
  country_id: companyCountryId,
  ...(transformTogetFees.offboarding && {
    offboarding: transformTogetFees.offboarding,
  }),
  ...(transformTogetFees.onboarding && {
    onboarding: transformTogetFees.onboarding,
  }),
  ...(transformTogetFees.onboarding_from_storage && {
    onboarding_from_storage: transformTogetFees.onboarding_from_storage,
  }),
});
