import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  BILLING_CURRENCY_CODES,
  filterBillingCurrencies,
} from "./billingCurrencies";

const apiSample = [
  { id: "1", name: "Nigerian Naira", code: "NGN" },
  { id: "2", name: "South African Rand", code: "ZAR" },
  { id: "3", name: "Egyptian Pound", code: "EGP" },
  { id: "4", name: "Kenyan Shilling", code: "KES" },
  { id: "5", name: "British Pound Sterling", code: "GBP" },
  { id: "6", name: "United States Dollar", code: "USD" },
  { id: "7", name: "Euro", code: "EUR" },
];

test("only the three billing currencies survive the filter", () => {
  const filtered = filterBillingCurrencies(apiSample);

  assert.deepEqual(
    filtered.map((currency) => currency.code),
    ["USD", "GBP", "EUR"],
  );
});

test("the egyptian pound is not mistaken for pounds sterling", () => {
  const codes = filterBillingCurrencies(apiSample).map(
    (currency) => currency.code,
  );

  assert.equal(codes.includes("EGP"), false);
});

test("options keep the api id and name so nothing is invented", () => {
  const [usd] = filterBillingCurrencies(apiSample);

  assert.equal(usd.id, "6");
  assert.equal(usd.name, "United States Dollar");
});

test("order follows the allowed list, not the api response order", () => {
  const reversed = filterBillingCurrencies([...apiSample].reverse());

  assert.deepEqual(
    reversed.map((currency) => currency.code),
    ["USD", "GBP", "EUR"],
  );
});

test("a lowercase api code still matches", () => {
  const filtered = filterBillingCurrencies([
    { id: "1", name: "United States Dollar", code: "usd" },
  ]);

  assert.deepEqual(
    filtered.map((currency) => currency.id),
    ["1"],
  );
});

test("a currency the api omits is skipped instead of faked", () => {
  const filtered = filterBillingCurrencies([
    { id: "1", name: "Euro", code: "EUR" },
  ]);

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].code, "EUR");
});

test("naira is not offered as a billing currency", () => {
  const codes = filterBillingCurrencies(apiSample).map(
    (currency) => currency.code,
  );

  assert.equal(codes.includes("NGN"), false);
});

test("an empty currency list yields no options", () => {
  assert.deepEqual(filterBillingCurrencies([]), []);
});

test("the company details step renders the filtered list", () => {
  const step = readFileSync(
    "src/container/NewOnboarding/Setup/CompanyDetailsStep.tsx",
    "utf8",
  );

  assert.match(step, /filterBillingCurrencies\(/);
  assert.equal(step.includes("toList<CurrencyOption>"), true);
});

test("the allowed codes stay usd, gbp and eur", () => {
  assert.deepEqual(BILLING_CURRENCY_CODES, ["USD", "GBP", "EUR"]);
});
