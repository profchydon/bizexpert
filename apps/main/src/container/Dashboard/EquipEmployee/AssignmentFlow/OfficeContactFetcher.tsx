import { useEffect } from "react";
import { useGetDeliveryContactsQuery } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";

interface OfficeContactFetcherProps {
  companyId: string;
  officeId: string;
  onContacts: (officeId: string, contacts: OfficeDeliveryContact[]) => void;
}

const OfficeContactFetcher: React.FC<OfficeContactFetcherProps> = ({
  companyId,
  officeId,
  onContacts,
}) => {
  const { data } = useGetDeliveryContactsQuery(
    { companyId, officeId },
    { skip: !companyId || !officeId },
  );

  useEffect(() => {
    if (data?.data) {
      onContacts(officeId, data.data);
    }
  }, [data, officeId, onContacts]);

  return null;
};

export default OfficeContactFetcher;
