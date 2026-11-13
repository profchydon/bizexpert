"use client";

import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useGetCurrenciesQuery } from "@/api/baseQueries/currenciesApi/getCurrencies";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STEP_META, TOTAL_STEPS } from "../data/stepMeta";
import {
  type CurrencyOption,
  filterBillingCurrencies,
} from "../lib/billingCurrencies";
import { toList } from "../lib/toList";
import type { Answers } from "../lib/types";

export function CompanyDetailsStep({
  answers,
  showErrors,
  onAnswer,
}: {
  answers: Answers;
  showErrors: boolean;
  onAnswer: (key: string, value: string) => void;
}) {
  const meta = STEP_META[3];
  const { data: countriesRes, isFetching: isCountriesLoading } =
    useGetCountriesQuery();
  const { data: currenciesRes, isFetching: isCurrenciesLoading } =
    useGetCurrenciesQuery();

  const countries = toList<{ id: string; name: string }>(countriesRes?.data);
  const currencies = filterBillingCurrencies(
    toList<CurrencyOption>(currenciesRes?.data),
  );

  const name = (answers.name as string) ?? "";
  const tradingName = (answers.trading_name as string) ?? "";
  const address = (answers.address as string) ?? "";
  const country = (answers.country as string) ?? "";
  const billingCurrency = (answers.billing_currency as string) ?? "";
  const addressLabel =
    answers.work_setup === "fully_remote"
      ? "Registered address"
      : "Corporate address";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary-600 uppercase">
          Step 4 of {TOTAL_STEPS} · {meta.label}
        </p>
        <h2 className="mt-1.5 text-2xl font-bold text-gray-900">
          {meta.heading}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{meta.sub}</p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Business name
          </label>
          <Input
            placeholder="Acme Inc."
            value={name}
            onChange={(event) => onAnswer("name", event.target.value)}
            data-testid="companydetailsstep-input"
          />
          {showErrors && !name.trim() && (
            <p className="mt-1 text-xs text-error-600">
              This field is required.
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Trading name (optional)
          </label>
          <Input
            placeholder="Acme"
            value={tradingName}
            onChange={(event) => onAnswer("trading_name", event.target.value)}
            data-testid="companydetailsstep-input-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            The name you trade under, if different from your legal business
            name. Also known as a dBA.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {addressLabel}
          </label>
          <Input
            placeholder="123 Main Street"
            value={address}
            onChange={(event) => onAnswer("address", event.target.value)}
            data-testid="companydetailsstep-input-3"
          />
          {showErrors && !address.trim() && (
            <p className="mt-1 text-xs text-error-600">
              This field is required.
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Country
          </label>
          <Select
            value={country || undefined}
            disabled={isCountriesLoading}
            onValueChange={(value) => onAnswer("country", value)}
            data-testid="companydetailsstep-select"
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isCountriesLoading ? "Loading countries…" : "Select country"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {countries.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showErrors && !country && (
            <p className="mt-1 text-xs text-error-600">
              This field is required.
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Currency
          </label>
          <Select
            value={billingCurrency || undefined}
            disabled={isCurrenciesLoading}
            onValueChange={(value) => onAnswer("billing_currency", value)}
            data-testid="companydetailsstep-select-2"
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isCurrenciesLoading
                    ? "Loading currencies…"
                    : "Select currency"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((item) => (
                <SelectItem key={item.id} value={item.code}>
                  {item.code} — {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showErrors && !billingCurrency && (
            <p className="mt-1 text-xs text-error-600">
              This field is required.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
