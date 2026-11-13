const PLACES_SCRIPT_ORIGIN = "https://maps.googleapis.com/maps/api/js";

export function googlePlacesScriptSrc(apiKey: string | undefined): string {
  const key = apiKey?.trim();
  if (!key) {
    return "";
  }

  const params = new URLSearchParams({
    key,
    libraries: "places",
    callback: "mapFinder",
  });

  return `${PLACES_SCRIPT_ORIGIN}?${params.toString()}`;
}
