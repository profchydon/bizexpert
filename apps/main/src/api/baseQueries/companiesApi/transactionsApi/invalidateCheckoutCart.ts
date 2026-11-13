import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { cartApi } from "@/api/baseQueries/cartApi";

type AppDispatch = ThunkDispatch<unknown, unknown, UnknownAction>;

export function invalidateCheckoutCart(dispatch: AppDispatch) {
  dispatch(cartApi.util.invalidateTags(["Cart"]));
}
