/**
 * Converts a 2-letter ISO country code into a flag emoji using the Unicode
 * regional indicator symbol trick, so a country badge doesn't need to ship a
 * flag-icon asset library. Returns an empty string for anything that isn't a
 * clean 2-letter code (callers should just render the text label in that case).
 */
export const countryCodeToFlagEmoji = (code?: string): string => {
  if (!code || code.length !== 2) {
    return "";
  }

  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));

  if (codePoints.some((point) => point < 127462 || point > 127487)) {
    return "";
  }

  return String.fromCodePoint(...codePoints);
};
