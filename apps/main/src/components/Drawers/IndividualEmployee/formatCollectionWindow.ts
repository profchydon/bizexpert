import dayjs from "dayjs";

const DATE_FORMAT = "MMM DD, YYYY";

export interface CollectionWindowInput {
  collection_date_start?: string | null;
  collection_date_end?: string | null;
  collection_date?: string | null;
}

const formatDate = (value?: string | null): string | null => {
  if (!value) return null;
  const date = dayjs(value);
  return date.isValid() ? date.format(DATE_FORMAT) : null;
};

export const formatCollectionWindow = (
  subOrder: CollectionWindowInput | undefined | null,
): string | null => {
  if (!subOrder) return null;

  const start = formatDate(subOrder.collection_date_start);
  const end = formatDate(subOrder.collection_date_end);

  if (start) {
    return end && end !== start ? `${start} - ${end}` : start;
  }

  return formatDate(subOrder.collection_date);
};
