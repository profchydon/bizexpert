import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import {
  countryMatchesOfficeRegion,
  findCountryForOfficeRegion,
  type OfficeMarketplaceCountry,
} from "./officeMarketplace";

export function useOfficeMarketplaceCountry(
  office: { id: string; region: string } | undefined,
  countries: OfficeMarketplaceCountry[],
) {
  const dispatch = useAppDispatch();
  const {
    equipEmployee: { country },
  } = useAppSelector((state) => state.persistedReducers);
  const appliedOfficeId = useRef<string | null>(null);

  useEffect(() => {
    if (!office?.id || !office.region || countries.length === 0) return;
    if (appliedOfficeId.current === office.id) return;
    appliedOfficeId.current = office.id;
    if (countryMatchesOfficeRegion(country, office.region)) return;
    const match = findCountryForOfficeRegion(countries, office.region);
    if (!match) return;
    dispatch(
      setCountry({
        id: match.id,
        name: match.name,
        code: match.code,
      }),
    );
  }, [countries, country, dispatch, office?.id, office?.region]);
}
