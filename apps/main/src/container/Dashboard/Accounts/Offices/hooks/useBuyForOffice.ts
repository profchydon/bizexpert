import { useMemo } from "react";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { setOfficePreseed } from "@/container/Dashboard/EquipEmployee/AssignmentFlow/officePreseed";
import type { Office } from "../../types";

export function canShowBuyForOffice(
  office: Office | undefined,
  canManage: boolean,
): boolean {
  return Boolean(office && canManage);
}

export function useBuyForOffice(
  office: Office | undefined,
  canManage: boolean,
) {
  const { push } = useTransitionRouter();

  const canBuy = canShowBuyForOffice(office, canManage);

  const buyForOffice = useMemo(
    () => () => {
      if (!office || !canBuy) return;
      setOfficePreseed(office.id);
      push(`${routes.EQUIP_EMPLOYEE_MARKETPLACE}?office=${office.id}`);
    },
    [canBuy, office, push],
  );

  return { canBuy, buyForOffice };
}
