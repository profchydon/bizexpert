"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { bizexpertApi } from "@/lib/bizexpert/api";
import {
  getBusiness,
  setBusiness as persistBusiness,
} from "@/lib/bizexpert/auth";
import type { Business, Location } from "@/types/bizexpert";
import { useBizExpertAuth } from "@/store/bizexpert/auth-context";
import { resolveLocationId } from "@/store/bizexpert/business-location";

interface BusinessContextType {
  business: Business | null;
  locationId: string | null;
  locations: Location[];
  setLocationId: (id: string | null) => void;
  refreshBusiness: () => Promise<void>;
  businessId: string | null;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

const LOCATION_KEY = "bizexpert_location_id";

export function BizExpertBusinessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { business: authBusiness, setBusiness: setAuthBusiness } =
    useBizExpertAuth();
  const [business, setBusinessState] = useState<Business | null>(null);
  const [locationId, setLocationIdState] = useState<string | null>(null);

  const applyBusinessPayload = useCallback(
    (data: Business) => {
      setBusinessState(data);
      persistBusiness(data);
      setAuthBusiness(data);
      const locs: Location[] = data.locations ?? [];
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem(LOCATION_KEY)
          : null;
      const nextId = resolveLocationId(locs, stored);
      if (nextId) {
        setLocationIdState(nextId);
        localStorage.setItem(LOCATION_KEY, nextId);
      }
    },
    [setAuthBusiness],
  );

  const refreshBusiness = useCallback(async () => {
    const id = business?.id ?? authBusiness?.id ?? getBusiness()?.id ?? null;
    if (!id) return;
    const res = await bizexpertApi.get(`/businesses/${id}`);
    applyBusinessPayload(res.data);
  }, [applyBusinessPayload, authBusiness?.id, business?.id]);

  const authBusinessId = authBusiness?.id;

  useEffect(() => {
    const cached = getBusiness();
    const id = authBusinessId ?? cached?.id;
    if (!id) return;
    if (cached?.id === id) setBusinessState(cached);
    let cancelled = false;
    void (async () => {
      const res = await bizexpertApi.get(`/businesses/${id}`);
      if (cancelled) return;
      applyBusinessPayload(res.data);
    })();
    return () => {
      cancelled = true;
    };
  }, [authBusinessId, applyBusinessPayload]);

  const setLocationId = useCallback((id: string | null) => {
    setLocationIdState(id);
    if (id) localStorage.setItem(LOCATION_KEY, id);
    else localStorage.removeItem(LOCATION_KEY);
  }, []);

  const locations = business?.locations ?? [];

  return (
    <BusinessContext.Provider
      value={{
        business,
        locationId,
        locations,
        setLocationId,
        refreshBusiness,
        businessId: business?.id ?? null,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBizExpertBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    throw new Error(
      "useBizExpertBusiness must be used within BizExpertBusinessProvider",
    );
  }
  return ctx;
}
