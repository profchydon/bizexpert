"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import { AddProductEntryDialog } from "./AddProductEntryDialog";
import { ProductBulkImportSlideout } from "./ProductBulkImportSlideout";
import { ProductsTable } from "./ProductsTable";
import { SingleProductCreateSlideout } from "./SingleProductCreateSlideout";
import { productsPageSectionClass } from "./productsPageClasses";

export default function Products() {
  const { businessId } = useBizExpertBusiness();
  const [entryOpen, setEntryOpen] = useState(false);
  const [singleOpen, setSingleOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

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
    <section className={productsPageSectionClass}>
      <PageHeader
        pageTitle="Products"
        pageDescription="Catalog products and services with stores, variants, and CSV import."
        breadCrumbs={["Inventory", "Products"]}
      >
        <Button variant="primary" size="md" onClick={() => setEntryOpen(true)}>
          Add new product
        </Button>
      </PageHeader>
      <ProductsTable onCreate={() => setEntryOpen(true)} />
      <AddProductEntryDialog
        isOpen={entryOpen}
        onClose={() => setEntryOpen(false)}
        onSingle={() => setSingleOpen(true)}
        onBulk={() => setBulkOpen(true)}
      />
      <SingleProductCreateSlideout
        isOpen={singleOpen}
        onClose={() => setSingleOpen(false)}
      />
      <ProductBulkImportSlideout
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
      />
    </section>
  );
}
