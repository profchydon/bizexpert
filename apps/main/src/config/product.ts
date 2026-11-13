export function isBizExpertApp(): boolean {
  return process.env.NEXT_PUBLIC_PRODUCT === "bizexpert";
}
