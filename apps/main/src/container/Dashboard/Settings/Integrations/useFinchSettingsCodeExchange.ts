import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLazyVerifyFinchCodeQuery } from "@/api/baseQueries/companiesApi/integrationsApi/verifyFinchCode";
import {
  exchangeFinchAuthorizationCodeOnce,
  shouldExchangeFinchAuthorizationCode,
} from "@/utils/finchAuthorizationCode";
import { buildIntegrationsSettingsPath } from "./integrationsSearchParams";

export function useFinchSettingsCodeExchange(companyId?: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string;
  const service = searchParams.get("service") as string;
  const entity = searchParams.get("entity");

  const [
    verifyFinchCode,
    {
      isLoading: isLoading_verifyFinch,
      isFetching: isFetching_verifyFinch,
      isError: verifyFinch_error,
    },
  ] = useLazyVerifyFinchCodeQuery();

  useEffect(() => {
    if (
      !companyId ||
      !shouldExchangeFinchAuthorizationCode({ code, service, companyId })
    ) {
      return;
    }

    let cancelled = false;

    exchangeFinchAuthorizationCodeOnce(code, () =>
      verifyFinchCode({ companyId, code }).unwrap(),
    )
      .then((payload) => {
        if (cancelled || !payload?.success) {
          return;
        }

        const {
          integration,
          integration_id,
          code: exchangedCode,
        } = payload?.data;
        router.replace(
          buildIntegrationsSettingsPath({
            category: "hris",
            view: "all",
            extra: {
              integration,
              integration_id,
              code: exchangedCode,
              entity,
            },
          }),
        );
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [code, service, companyId, entity, verifyFinchCode, router]);

  return {
    isLoading_verifyFinch,
    isFetching_verifyFinch,
    verifyFinch_error,
  };
}
