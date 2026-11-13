export function categoryDeleteTitle(): string {
  return "Delete category";
}

export function categoryDeleteDescription(
  name: string,
  productCount: number,
): string {
  if (productCount > 0) {
    const noun = productCount === 1 ? "product" : "products";
    return `${name} is used by ${productCount} ${noun} and cannot be deleted.`;
  }
  return `This will remove ${name} from your categories.`;
}

export function canConfirmCategoryDelete(productCount: number): boolean {
  return productCount === 0;
}
