import type { ICart, ICartCountry } from "@/types/cart";
import type { IEmployees } from "@/types/employees";
import type { DeviceConfig, EquipDeviceItem } from "./equipTypes";
import type { EquipReviewEmployee } from "./equipTypes";
import {
  resolveEmployeeCountry,
  type CountryOption,
} from "./resolveEmployeeCountryId";

const deviceSetup = (config: DeviceConfig): string | undefined =>
  config === "none" ? undefined : config;

const cartCountry = (country?: ICartCountry): Partial<ICart> =>
  country && (country.code || country.name) ? { country } : {};

const storageItemToCart = (
  item: EquipDeviceItem,
  country?: ICartCountry,
): ICart => {
  const images = item.thumbnail ? [item.thumbnail] : [];
  return {
    asset: { name: item.name, images } as unknown as ICart["asset"],
    specification: {
      id: item.productId,
      properties: item.specs ? [{ name: "", value: item.specs }] : [],
      spec: item.specs ? [{ name: "", value: item.specs }] : [],
    } as unknown as ICart["specification"],
    pricing: {
      id: item.productId,
      amount: "0",
      currency_code: item.currency,
      country_id: country?.id,
      asset_specification_id: item.productId,
    },
    quantity: item.quantity,
    amount: "0",
    images,
    device_setup: deviceSetup(item.config),
    ...(item.fulfilmentDate ? { fulfillment_date: item.fulfilmentDate } : {}),
    source: "STORAGE",
    storage: true,
    equipmentId: item.productId,
    ...cartCountry(country),
  };
};

export const equipItemToCart = (
  item: EquipDeviceItem,
  country?: ICartCountry,
): ICart | null => {
  if (item.source === "STORAGE") return storageItemToCart(item, country);

  const asset = item.asset;
  const pricingId = asset?.asset_pricing?.id;
  if (!asset || !pricingId) return null;

  const amount = asset.asset_pricing?.amount ?? "0";

  return {
    asset,
    specification: {
      id: asset.asset_spec_id,
      properties: asset.spec ?? [],
      spec: asset.spec ?? [],
      asset_pricing: asset.asset_pricing,
    },
    pricing: {
      id: pricingId,
      amount,
      currency_code: asset.asset_pricing?.currency?.code,
      country_id: country?.id,
      asset_specification_id: asset.asset_spec_id,
    },
    quantity: item.quantity,
    amount,
    images: asset.images ?? [],
    device_setup: deviceSetup(item.config),
    ...(item.fulfilmentDate ? { fulfillment_date: item.fulfilmentDate } : {}),
    ...cartCountry(country),
  };
};

export const buildEquipCheckoutEmployees = (
  review: EquipReviewEmployee[],
  fullEmployeeById: Map<string, IEmployees>,
  countryByEmployeeId: Record<string, ICartCountry | undefined>,
): IEmployees[] =>
  review
    .map((reviewEmployee): IEmployees | null => {
      const full = fullEmployeeById.get(String(reviewEmployee.id));
      const country = countryByEmployeeId[reviewEmployee.id];
      const items = reviewEmployee.devices
        .map((device) => equipItemToCart(device, country))
        .filter((cart): cart is ICart => cart !== null);

      if (!full || items.length === 0) return null;

      return {
        ...full,
        country_id: country?.id ?? full.country_id,
        items,
      };
    })
    .filter((employee): employee is IEmployees => employee !== null);

export const buildEquipCheckout = (
  review: EquipReviewEmployee[],
  equipEmployees: IEmployees[] | undefined,
  countries: CountryOption[],
): IEmployees[] => {
  const fullById = new Map(
    (equipEmployees ?? []).map((employee) => [String(employee.id), employee]),
  );
  const countryByEmployeeId: Record<string, ICartCountry | undefined> =
    Object.fromEntries(
      review.map((reviewEmployee) => {
        const full = fullById.get(String(reviewEmployee.id));
        const matched = resolveEmployeeCountry(full, countries);
        return [
          reviewEmployee.id,
          {
            id: matched?.id ?? full?.country_id,
            code: matched?.code ?? matched?.country_code ?? full?.country_code,
            name: matched?.name ?? full?.country,
          },
        ];
      }),
    );

  return buildEquipCheckoutEmployees(review, fullById, countryByEmployeeId);
};
