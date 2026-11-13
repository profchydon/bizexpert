import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

import { assetsApi } from "@/api/baseQueries/assetsApi";
import { cartApi } from "@/api/baseQueries/cartApi";
import { feesApi } from "@/api/baseQueries/feesApi";

import { companiesApi } from "../..";

import {
  TAX_DISPLAY_COMPANY_TAGS,
  TAX_PRICE_CACHE_TAGS_BY_SLICE,
} from "./taxPriceCacheTags";

type Dispatch = ThunkDispatch<unknown, unknown, UnknownAction>;

export function invalidateTaxPriceCaches(dispatch: Dispatch): void {
  dispatch(companiesApi.util.invalidateTags([...TAX_DISPLAY_COMPANY_TAGS]));
  dispatch(
    assetsApi.util.invalidateTags([...TAX_PRICE_CACHE_TAGS_BY_SLICE.assetsApi]),
  );
  dispatch(
    cartApi.util.invalidateTags([...TAX_PRICE_CACHE_TAGS_BY_SLICE.cartApi]),
  );
  dispatch(
    feesApi.util.invalidateTags([...TAX_PRICE_CACHE_TAGS_BY_SLICE.feesApi]),
  );
}
