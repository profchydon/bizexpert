"use client";

import Script from "next/script";
import { googlePlacesScriptSrc } from "@/utils/googlePlacesScriptSrc";

export function GooglePlacesScript() {
  const src = googlePlacesScriptSrc(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
  if (!src) {
    return null;
  }

  return (
    <Script id="google-maps-places" src={src} strategy="afterInteractive" />
  );
}
