import { useGetBankDetailsQuery } from "@/api/baseQueries/countriesApi/getBankDetails";
import { Separator } from "@/components/ui/separator";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import React from "react";

const BankTransferMethod = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const { data: bankDetailsRes, isLoading } = useGetBankDetailsQuery({
    countryId: company?.country?.id as string,
  });

  const bankDetails = bankDetailsRes?.data;

  return (
    <div className="h-screen flex flex-col">
      <ul className="flex flex-col">
        {isLoading && <>Fetching bank details...</>}
        {bankDetails &&
          Object.entries(bankDetails).map(([title, value]) => (
            <>
              <li
                className="flex flex-col gap-y-[4px] text-gray-700"
                key={title}
              >
                <h5 className="font-medium text-sm">{title}</h5>
                <p className="font-normal">{value as string}</p>
              </li>
              <Separator className="my-[1.25rem] last-of-type:hidden" />
            </>
          ))}
      </ul>
    </div>
  );
};

export default BankTransferMethod;
