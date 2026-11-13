import { ReactNode } from "react";

export default function VerificationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-24 page-px">
      <div className="w-full">{children}</div>
    </div>
  );
}
