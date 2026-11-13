"use client";

import { useEffect, useState } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type TaxDisplayMode, useTaxContext } from "@/hooks/useTaxContext";
import { TaxWorkedExample } from "./TaxWorkedExample";
import { toast } from "sonner";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useSetTaxDisplayMutation } from "@/api/baseQueries/companiesApi/settingsApi/taxDisplayApi/setTaxDisplay";
import { cn } from "@/lib/utils";

// Section 1 of Billing and tax: how marketplace prices display. The radio selection is a draft that
// only persists on Save, matching the other saveable sections on this page. Cancel reverts to the
// stored choice; both actions disable when there is nothing to save.
export function TaxDisplayCard() {
  const { mode: persisted } = useTaxContext();
  const [draft, setDraft] = useState<TaxDisplayMode>(persisted);
  const companyId = useWorkspaceCompanyId();
  const [setTaxDisplay, { isLoading }] = useSetTaxDisplayMutation();

  // Re-sync the draft if the persisted mode changes elsewhere (another tab or surface).
  useEffect(() => setDraft(persisted), [persisted]);

  const dirty = draft !== persisted;

  async function handleSave() {
    if (!companyId) return;

    try {
      await setTaxDisplay({
        companyId,
        payload: { tax_display_mode: draft },
      }).unwrap();

      toast.success("Settings saved", {
        description:
          "Tax display updated. Prices across the marketplace now follow your choice.",
      });
    } catch (error) {
      toast.error("Failed to save settings", {
        description: "Please try again later.",
      });
    }
  }

  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex shrink-0 flex-col gap-1 lg:w-[280px]">
        <h2 className="text-sm font-semibold text-gray-900">
          How tax is shown
        </h2>
        <p className="text-sm text-gray-600">
          Choose whether marketplace prices include tax or show it at checkout.
          This never changes the amount you pay.
        </p>
      </div>

      <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-6 p-6">
          <RadioGroupPrimitive.Root
            value={draft}
            onValueChange={(value) => setDraft(value as TaxDisplayMode)}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <Label
              htmlFor="inclusive"
              className={cn(
                "group relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:border-gray-300",
                draft === "inclusive"
                  ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                  : "border-gray-200 bg-white",
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-8">
                <p
                  className={cn(
                    "text-sm font-semibold select-none",
                    draft === "inclusive"
                      ? "text-primary-700"
                      : "text-gray-900",
                  )}
                >
                  Tax-inclusive prices
                </p>
                <p
                  className={cn(
                    "text-sm font-normal",
                    draft === "inclusive"
                      ? "text-primary-700"
                      : "text-gray-600",
                  )}
                >
                  Browse and checkout show the final price with tax included.
                </p>
              </div>
              <RadioGroupPrimitive.Item
                value="inclusive"
                id="inclusive"
                className={cn(
                  "absolute right-4 top-4 flex size-4 min-h-4 min-w-4 items-center justify-center rounded-full bg-white ring-1 ring-inset ring-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-950",
                  draft === "inclusive" && "bg-primary-600 ring-primary-600",
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <div className="size-1.5 rounded-full bg-white" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
            </Label>

            <Label
              htmlFor="at-payment"
              className={cn(
                "group relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:border-gray-300",
                draft === "at-payment"
                  ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                  : "border-gray-200 bg-white",
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-8">
                <p
                  className={cn(
                    "text-sm font-semibold select-none",
                    draft === "at-payment"
                      ? "text-primary-700"
                      : "text-gray-900",
                  )}
                >
                  Tax shown at payment
                </p>
                <p
                  className={cn(
                    "text-sm font-normal",
                    draft === "at-payment"
                      ? "text-primary-700"
                      : "text-gray-600",
                  )}
                >
                  Browse shows prices before tax. Tax appears as separate lines
                  at checkout.
                </p>
              </div>
              <RadioGroupPrimitive.Item
                value="at-payment"
                id="at-payment"
                className={cn(
                  "absolute right-4 top-4 flex size-4 min-h-4 min-w-4 items-center justify-center rounded-full bg-white ring-1 ring-inset ring-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-950",
                  draft === "at-payment" && "bg-primary-600 ring-primary-600",
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <div className="size-1.5 rounded-full bg-white" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>
            </Label>
          </RadioGroupPrimitive.Root>

          <div className="h-px w-full bg-gray-200" />

          <TaxWorkedExample mode={draft} />
        </div>

        <div className="h-px w-full bg-gray-200" />
        <div className="flex justify-end gap-3 p-6">
          <Button
            variant="outline"
            className="h-max rounded-lg px-3.5 py-2.5 text-sm font-semibold"
            disabled={!dirty || isLoading}
            onClick={() => setDraft(persisted)}
            data-testid="taxdisplaycard-button"
          >
            Cancel
          </Button>
          <Button
            className="h-max rounded-lg px-3.5 py-2.5 text-sm font-semibold"
            disabled={!dirty || isLoading}
            onClick={handleSave}
            data-testid="taxdisplaycard-button-2"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </section>
  );
}
