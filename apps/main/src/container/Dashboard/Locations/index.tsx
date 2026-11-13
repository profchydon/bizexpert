"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { LocationsTable } from "./LocationsTable";
import { CreateLocation } from "./CreateLocation";
import { locationsPageSectionClass } from "./locationsPageClasses";

export default function Locations() {
  const { businessId } = useBizExpertBusiness();
  const [createOpen, setCreateOpen] = useState(false);

  if (!businessId) {
    return (
      <p className="py-8 text-secondary">
        No business selected.{" "}
        <a href="/onboarding/business" className="text-brand-600 underline">
          Create one
        </a>
      </p>
    );
  }

  return (
    <section className={locationsPageSectionClass}>
      <PageHeader
        pageTitle="Stores"
        pageDescription="Create regular stores and warehouses, set VAT, and manage staff access."
        breadCrumbs={["Inventory", "Stores"]}
      >
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setCreateOpen(true)}
          >
            Add new store
          </Button>
        </div>
      </PageHeader>
      <div className="w-full">
        <LocationsTable onCreate={() => setCreateOpen(true)} />
      </div>
      <CreateLocation
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  );
}
