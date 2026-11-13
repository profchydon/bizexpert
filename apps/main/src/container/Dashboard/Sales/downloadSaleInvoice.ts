import { bizexpertApi } from "@/lib/bizexpert/api";

export async function downloadSaleInvoice(
  businessId: string,
  saleId: string,
  saleNumber: string,
) {
  const res = await bizexpertApi.get(
    `/businesses/${businessId}/sales/${saleId}/invoice`,
    { responseType: "blob" },
  );
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${saleNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
