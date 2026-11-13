import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  viewEquipmentDetailCardBodyClass,
  viewEquipmentDetailCardClass,
  viewEquipmentDetailCardHeaderClass,
  viewEquipmentDetailCardTitleClass,
  viewEquipmentDetailFieldClass,
  viewEquipmentDetailFieldLabelClass,
  viewEquipmentDetailFieldValueClass,
  viewEquipmentDetailGridClass,
} from "./viewEquipmentClasses";

type DetailCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ViewEquipmentDetailCard({
  title,
  action,
  children,
  className,
}: DetailCardProps) {
  return (
    <section className={cn(viewEquipmentDetailCardClass, className)}>
      <div className={viewEquipmentDetailCardHeaderClass}>
        <h2 className={viewEquipmentDetailCardTitleClass}>{title}</h2>
        {action}
      </div>
      <div className={viewEquipmentDetailCardBodyClass}>{children}</div>
    </section>
  );
}

export function ViewEquipmentDetailGrid({ children }: { children: ReactNode }) {
  return <div className={viewEquipmentDetailGridClass}>{children}</div>;
}

export function ViewEquipmentDetailField({
  label,
  children,
  wide,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        viewEquipmentDetailFieldClass,
        wide && "col-span-2 lg:col-span-4",
      )}
    >
      <div className={viewEquipmentDetailFieldLabelClass}>{label}</div>
      <div className={viewEquipmentDetailFieldValueClass}>{children}</div>
    </div>
  );
}
