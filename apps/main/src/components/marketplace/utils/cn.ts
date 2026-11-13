import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Must match `prefix` in tailwind.config.js, otherwise merging can't tell that
// `mp-p-3` and `mp-p-4` are the same utility and both survive into the output.
const twMerge = extendTailwindMerge({ prefix: "mp-" });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
