"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { formatNgn } from "@/lib/bizexpert/format";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Product } from "@/types/bizexpert";
import { ProductFormSlideout } from "../ProductFormSlideout";
import { ProductStatusBadge } from "../ProductStatusBadge";
import { productsPageSectionClass } from "../productsPageClasses";
import { productsQueryKeys } from "../productsQueryKeys";
import { AddUnitSlideout } from "./AddUnitSlideout";
import { ProductUnitsPanel } from "./ProductUnitsPanel";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { businessId } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: productsQueryKeys.detail(businessId ?? "", id),
    enabled: !!businessId && !!id,
    queryFn: async () =>
      (await bizexpertApi.get(`/businesses/${businessId}/products/${id}`))
        .data as Product,
  });

  if (!businessId) {
    return <p className="py-8 text-secondary">No business selected.</p>;
  }

  return (
    <section className={productsPageSectionClass}>
      <PageHeader
        pageTitle={product?.name ?? "Product"}
        pageDescription={`${product?.sku ? `SKU ${product.sku}` : "No SKU"} · Base unit ${product?.baseUnit ?? "—"}`}
        breadCrumbs={["Products", product?.name ?? "Product"]}
      >
        <div className="flex flex-wrap items-center justify-end gap-3">
          {product ? <ProductStatusBadge isActive={product.isActive} /> : null}
          <Button
            variant="outline"
            size="md"
            isLoading={isPending}
            onClick={() => push("/dashboard/products")}
          >
            Back
          </Button>
          <Button variant="outline" size="md" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button variant="primary" size="md" onClick={() => setUnitOpen(true)}>
            Add unit
          </Button>
        </div>
      </PageHeader>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-gray-500">Selling price</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {product ? formatNgn(product.sellingPrice) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Purchase cost</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {product ? formatNgn(product.purchaseCost) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Low stock</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {product ? Number(product.lowStockThreshold) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Category</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {product?.category || "—"}
          </dd>
        </div>
      </dl>
      <ProductUnitsPanel
        businessId={businessId}
        productId={id}
        baseUnit={product?.baseUnit ?? "piece"}
        units={product?.productUnits ?? []}
        isLoading={isLoading}
        isError={isError}
        onAdd={() => setUnitOpen(true)}
      />
      <ProductFormSlideout
        isOpen={editOpen}
        product={product}
        onClose={() => setEditOpen(false)}
      />
      <AddUnitSlideout
        isOpen={unitOpen}
        onClose={() => setUnitOpen(false)}
        businessId={businessId}
        productId={id}
        baseUnit={product?.baseUnit ?? "piece"}
      />
    </section>
  );
}
