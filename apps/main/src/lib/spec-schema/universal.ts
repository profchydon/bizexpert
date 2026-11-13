import type { SpecSection } from "./types";

export const universalSection: SpecSection = {
  id: "general",
  title: "General",
  description: "Shared details that apply regardless of device type.",
  fields: [
    {
      id: "brand",
      label: "Brand / Manufacturer",
      kind: "combobox",
      allowOther: true,
      requiredForVendor: true,
      options: [
        { id: "apple", label: "Apple" },
        { id: "dell", label: "Dell" },
        { id: "hp", label: "HP" },
        { id: "lenovo", label: "Lenovo" },
        { id: "microsoft", label: "Microsoft" },
        { id: "samsung", label: "Samsung" },
        { id: "lg", label: "LG" },
        { id: "asus", label: "ASUS" },
        { id: "acer", label: "Acer" },
        { id: "msi", label: "MSI" },
        { id: "huawei", label: "Huawei" },
      ],
    },
    {
      id: "model_name",
      label: "Model",
      kind: "text",
      placeholder: "e.g. MacBook Pro 14-inch (2024)",
    },
    {
      id: "condition",
      label: "Condition",
      kind: "select",
      options: [
        { id: "new", label: "New" },
        { id: "refurbished", label: "Certified Refurbished" },
        { id: "used_good", label: "Used — Good" },
        { id: "used_fair", label: "Used — Fair" },
      ],
    },
    {
      id: "warranty_period",
      label: "Warranty",
      kind: "select",
      options: [
        { id: "none", label: "No warranty" },
        { id: "1y", label: "1 year" },
        { id: "2y", label: "2 years" },
        { id: "3y", label: "3 years" },
        { id: "4y", label: "4 years" },
        { id: "5y_plus", label: "5+ years" },
      ],
    },
    {
      id: "colour",
      label: "Colour",
      kind: "combobox",
      allowOther: true,
      options: [
        { id: "space_grey", label: "Space Grey" },
        { id: "silver", label: "Silver" },
        { id: "black", label: "Black" },
        { id: "white", label: "White" },
        { id: "gold", label: "Gold" },
        { id: "blue", label: "Blue" },
        { id: "rose_gold", label: "Rose Gold" },
      ],
    },
  ],
};
