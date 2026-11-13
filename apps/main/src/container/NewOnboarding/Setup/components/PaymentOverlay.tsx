"use client";

import { Loader2 } from "lucide-react";

export function PaymentOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <Loader2 className="size-10 animate-spin text-primary-600" />
      <div className="max-w-md">
        <p className="text-lg font-semibold text-gray-900">
          Redirecting you to checkout
        </p>
        <p className="mt-1.5 text-sm text-gray-500">
          Securely setting up your subscription — this will only take a moment.
        </p>
      </div>
    </div>
  );
}
