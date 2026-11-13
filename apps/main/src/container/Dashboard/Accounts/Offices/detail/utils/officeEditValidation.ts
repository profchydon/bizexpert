export interface OfficeEditDraft {
  name: string;
  physical: boolean;
  address: string;
}

export function getOfficeEditValidation({
  name,
  physical,
  address,
}: OfficeEditDraft) {
  const nameInvalid = name.trim().length === 0;
  const addressInvalid = physical && address.trim().length === 0;
  return {
    nameInvalid,
    addressInvalid,
    canSave: !nameInvalid && !addressInvalid,
  };
}
