import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function SlashCircleIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      stroke="currentColor"
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="m4.93 4.93 14.14 14.14M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
    </svg>
  );
}
