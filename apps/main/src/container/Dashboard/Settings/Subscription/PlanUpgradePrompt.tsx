"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { cn } from "@/lib/utils";
import routes from "@/routes";

export function PlanUpgradePrompt({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
}) {
  const { push, isPending } = useTransitionRouter();

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white px-8 py-16 text-center">
      <p className="text-sm font-medium text-primary-600">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <Button
        color="primary"
        size="md"
        isLoading={isPending}
        onClick={() => push(routes.SETTINGS_SUBSCRIPTION)}
        data-testid="planupgradeprompt-button"
      >
        View plans
      </Button>
      <Link
        href={backHref}
        aria-disabled={isPending}
        className={cn(
          "text-sm font-medium text-primary-600 hover:text-primary-700",
          isPending && "pointer-events-none",
        )}
      >
        {backLabel}
      </Link>
    </div>
  );
}
