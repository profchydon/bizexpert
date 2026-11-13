"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import { consumeRfqCreateRequestSession } from "./CustomDeviceRequestModal/rfqCreateRequestPrefillStorage";
import type { RfqCreateRequestSession } from "./CustomDeviceRequestModal/rfqCreateRequestPrefillStorage";
import {
  clearMarketplaceCreateRfqQueryHref,
  marketplaceCreateRfqCountryFromQuery,
  shouldOpenMarketplaceCreateRfq,
} from "./marketplaceCreateRfqQuery";

export function useMarketplaceCreateRfqFromQuery(
  onOpenCustomRequest: (session: RfqCreateRequestSession | null) => void,
) {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const handledCreateRfqRef = useRef(false);

  useEffect(() => {
    if (!shouldOpenMarketplaceCreateRfq(params)) {
      handledCreateRfqRef.current = false;
      return;
    }

    if (handledCreateRfqRef.current) {
      return;
    }

    handledCreateRfqRef.current = true;

    const country = marketplaceCreateRfqCountryFromQuery(params);

    if (country) {
      dispatch(setCountry(country));
    }

    onOpenCustomRequest(consumeRfqCreateRequestSession());
    router.replace(clearMarketplaceCreateRfqQueryHref(pathname, params));
  }, [dispatch, onOpenCustomRequest, params, pathname, router]);
}
