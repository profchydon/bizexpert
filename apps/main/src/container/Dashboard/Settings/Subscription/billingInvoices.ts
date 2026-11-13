import type {
  BillingInvoiceDeviceRate,
  SubscriptionBillingInvoice,
  SubscriptionBillingInvoiceList,
} from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";

const SORTS = new Set([
  "number",
  "billed_on",
  "plan",
  "devices",
  "amount",
  "status",
]);

const EMPTY_LIST: SubscriptionBillingInvoiceList = {
  data: [],
  total: 0,
  per_page: 15,
  current_page: 1,
  last_page: 1,
};

function record(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function text(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function num(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function rate(value: unknown): BillingInvoiceDeviceRate | null {
  const row = record(value);
  if (!row) return null;
  return {
    count: num(row.count),
    rate: text(row.rate),
    rate_display: text(row.rate_display),
  };
}

export function parseBillingInvoice(
  value: unknown,
): SubscriptionBillingInvoice | null {
  const row = record(value);
  if (!row || !text(row.id)) return null;
  const plan = record(row.plan);
  const devices = record(row.devices);
  const company = rate(devices?.company);
  const byod = rate(devices?.byod);
  const links = record(row.links);
  const period = record(row.period);
  const provider = text(row.provider);
  return {
    id: text(row.id),
    number: text(row.number) || text(row.id),
    billed_on: text(row.billed_on),
    plan: plan
      ? { id: text(plan.id), name: text(plan.name), slug: text(plan.slug) }
      : null,
    device_count: num(row.device_count),
    devices: company && byod ? { company, byod } : null,
    provider: provider === "stripe" || provider === "airwallex" ? provider : "",
    external_id: row.external_id == null ? null : text(row.external_id) || null,
    status: text(row.status),
    currency: text(row.currency),
    amount: text(row.amount),
    amount_display: text(row.amount_display),
    paid_at: row.paid_at == null ? null : text(row.paid_at) || null,
    period: {
      start: period?.start == null ? null : text(period.start) || null,
      end: period?.end == null ? null : text(period.end) || null,
    },
    links: {
      view: links?.view == null ? null : text(links.view) || null,
      download: links?.download == null ? null : text(links.download) || null,
    },
  };
}

export function parseBillingInvoiceList(
  payload: unknown,
): SubscriptionBillingInvoiceList {
  const root = record(payload);
  const data = record(root?.data);
  if (!data || !Array.isArray(data.data)) return EMPTY_LIST;
  return {
    data: data.data.flatMap((row) => {
      const parsed = parseBillingInvoice(row);
      return parsed ? [parsed] : [];
    }),
    total: num(data.total),
    per_page: num(data.per_page) || 15,
    current_page: num(data.current_page) || 1,
    last_page: num(data.last_page) || 1,
  };
}

export function invoiceOnScreen(
  selected: SubscriptionBillingInvoice | null,
  detail: unknown,
): SubscriptionBillingInvoice | null {
  if (!selected) return null;
  return parseBillingInvoice(detail) ?? selected;
}

export function billingSortBy(column: string | number | undefined): string {
  const value = String(column ?? "");
  return SORTS.has(value) ? value : "billed_on";
}

export function invoiceStatusLabel(status: string): string {
  if (status === "paid") return "Paid";
  if (status === "open") return "Open";
  if (status === "void") return "Void";
  return status || "Unknown";
}

export function invoiceStatusColor(
  status: string,
): "success" | "warning" | "gray" {
  if (status === "paid") return "success";
  if (status === "open") return "warning";
  return "gray";
}

export function invoiceStatusTooltip(status: string): string {
  if (status === "paid") return "Charged successfully to the card on file.";
  if (status === "open") return "This invoice is still unpaid.";
  if (status === "void") return "This invoice was voided.";
  return "Whether the charge went through.";
}

export const INVOICE_PAGE_SIZES = [10, 25, 50, 100];

export function billingHistoryEmpty(input: {
  filtering: boolean;
  isFree: boolean;
  freePlanName: string;
}): { title: string; description: string; clear: boolean } {
  if (input.filtering) {
    return {
      title: "No invoices match",
      description: "Nothing in your billing history matches that search.",
      clear: true,
    };
  }
  return {
    title: "No charges yet",
    description: input.isFree
      ? `${input.freePlanName} is free, so nothing has been billed. Renewals appear here once you move to a paid plan.`
      : "Subscription charges show up here after the first renewal.",
    clear: false,
  };
}

export function invoiceDownloadUrl(
  link: string | null | undefined,
  apiUrl: string,
): string | null {
  if (!link) return null;
  if (/^https?:\/\//.test(link)) return link;
  if (!link.startsWith("/")) return null;
  try {
    return `${new URL(apiUrl).origin}${link}`;
  } catch {
    return null;
  }
}
