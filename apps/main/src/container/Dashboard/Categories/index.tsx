"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Category } from "@/types/bizexpert";
import { CategoriesTable } from "./CategoriesTable";
import { CategoryFormSlideout } from "./CategoryFormSlideout";
import { categoriesPageSectionClass } from "./categoriesPageClasses";

export default function Categories() {
  const { businessId } = useBizExpertBusiness();
  const [createOpen, setCreateOpen] = useState(false);
  const [parentForSub, setParentForSub] = useState<Category | null>(null);

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

  const openMainCreate = () => {
    setParentForSub(null);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setParentForSub(null);
  };

  return (
    <section className={categoriesPageSectionClass}>
      <PageHeader
        pageTitle="Categories"
        pageDescription="Main categories and sub-categories for products, filters, and reports."
        breadCrumbs={["Inventory", "Categories"]}
      >
        <Button variant="primary" size="md" onClick={openMainCreate}>
          Add category
        </Button>
      </PageHeader>
      <CategoriesTable
        onCreate={openMainCreate}
        onCreateSub={(parent) => {
          setParentForSub(parent);
          setCreateOpen(true);
        }}
      />
      <CategoryFormSlideout
        isOpen={createOpen}
        parentCategory={parentForSub}
        onClose={closeCreate}
      />
    </section>
  );
}
