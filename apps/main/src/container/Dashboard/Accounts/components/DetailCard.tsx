import {
  detailCardBodyClass,
  detailCardClass,
  detailCardTitleClass,
  detailRowClass,
  detailRowLabelClass,
  detailRowValueClass,
} from "./detailCardClasses";

export function DetailCard({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className={detailCardClass}>
      <h2 className={detailCardTitleClass}>{title}</h2>
      <div className={detailCardBodyClass}>{children}</div>
      {footer}
    </section>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className={detailRowClass}>
      <span className={detailRowLabelClass}>{label}</span>
      <span className={detailRowValueClass}>{value}</span>
    </div>
  );
}
