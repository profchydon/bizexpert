import type { ReactNode } from "react";
import { Badge } from "@/components/base/badges/badges";
import {
  employeeDetailCardClass,
  employeeDetailCardDescriptionClass,
  employeeDetailCardHeaderClass,
  employeeDetailCardTitleClass,
} from "./employeeDetailClasses";

type Props = {
  title: string;
  description: string;
  badge?: ReactNode;
  children: ReactNode;
};

const DetailTableCard = ({ title, description, badge, children }: Props) => {
  return (
    <section className={employeeDetailCardClass}>
      <div className={employeeDetailCardHeaderClass}>
        <div className="flex items-center gap-2">
          <h2 className={employeeDetailCardTitleClass}>{title}</h2>
          {badge ?? null}
        </div>
        <p className={employeeDetailCardDescriptionClass}>{description}</p>
      </div>
      {children}
    </section>
  );
};

export const DetailTableCountBadge = ({ count }: { count: number }) => (
  <Badge color="brand" size="sm">
    {count}
  </Badge>
);

export default DetailTableCard;
