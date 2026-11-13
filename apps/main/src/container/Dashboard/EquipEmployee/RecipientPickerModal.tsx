"use client";

import { useMemo, useState } from "react";
import { Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { useGetDeliverableOfficesQuery } from "@/api/baseQueries/companiesApi/officesApi/getDeliverableOffices";
import { toUiOffice } from "@/container/Dashboard/Accounts/Offices/utils/mapServerOffice";
import {
  EMP_KEY,
  OFFICE_KEY,
  selectionLabel,
} from "./AssignmentFlow/recipientSelection";
import { setOfficePreseed } from "./AssignmentFlow/officePreseed";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

interface RecipientPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecipientPickerModal: React.FC<RecipientPickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { push } = useTransitionRouter();
  const companyId = useWorkspaceCompanyId();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"people" | "offices">("people");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data: employeesRes } = useGetEmployeesQuery(
    { companyId: companyId as string, params: { per_page: 50 } },
    { skip: !companyId || !isOpen },
  );
  const { data: officesRes } = useGetDeliverableOfficesQuery(
    { companyId: companyId as string },
    { skip: !companyId || !isOpen },
  );
  const people = useMemo(() => {
    const rows = employeesRes?.data?.data ?? [];
    return rows.map((employee) => ({
      key: `${EMP_KEY}${employee.id}`,
      name: `${employee.first_name || ""} ${employee.last_name || ""}`.trim(),
      country: String(employee.country || ""),
    }));
  }, [employeesRes]);
  const offices = useMemo(() => {
    const rows = officesRes?.data ?? [];
    return rows.map((row) => {
      const office = toUiOffice(row);
      return {
        key: `${OFFICE_KEY}${office.id}`,
        name: office.name,
        country: office.region,
      };
    });
  }, [officesRes]);
  const filtered = (tab === "offices" ? offices : people).filter((row) =>
    row.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const toggle = (key: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const start = () => {
    const officeKeys = Array.from(selected).filter((key) =>
      key.startsWith(OFFICE_KEY),
    );
    if (officeKeys[0]) {
      setOfficePreseed(officeKeys[0].slice(OFFICE_KEY.length));
    }
    onClose();
    push(routes.EQUIP_EMPLOYEE_MARKETPLACE);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-testid="recipientpickermodal-dialog"
    >
      <DialogContent className="max-w-[560px] p-0">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>Who is this for?</DialogTitle>
              <DialogDescription className="mt-1">
                Pick the people and offices you are buying for. You will choose
                devices next.
              </DialogDescription>
            </div>
            <button type="button" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-6 py-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            data-testid="recipientpickermodal-input"
          />
          <p className="text-sm text-gray-500">{selectionLabel(selected)}</p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={tab === "people" ? "default" : "outline"}
              onClick={() => setTab("people")}
              data-testid="recipientpickermodal-button"
            >
              People
            </Button>
            <Button
              type="button"
              size="sm"
              variant={tab === "offices" ? "default" : "outline"}
              onClick={() => setTab("offices")}
              data-testid="recipientpickermodal-button-2"
            >
              Offices
            </Button>
          </div>
        </div>
        <div className="max-h-[320px] overflow-y-auto border-t border-gray-200 px-6 py-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Nothing matches this search.
            </p>
          ) : (
            filtered.map((row) => (
              <label
                key={row.key}
                className="flex cursor-pointer items-center gap-3 py-2"
              >
                <Checkbox
                  checked={selected.has(row.key)}
                  onCheckedChange={() => toggle(row.key)}
                  data-testid="recipientpickermodal-checkbox"
                />
                {row.key.startsWith(OFFICE_KEY) ? (
                  <Building2 className="h-4 w-4 text-gray-500" />
                ) : null}
                <span className="text-sm font-medium text-gray-900">
                  {row.name}
                </span>
                {row.country && (
                  <span className="text-xs text-gray-500">{row.country}</span>
                )}
              </label>
            ))
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="recipientpickermodal-button-3"
          >
            Cancel
          </Button>
          <Button
            disabled={selected.size === 0}
            onClick={start}
            data-testid="recipientpickermodal-button-4"
          >
            Start equipping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipientPickerModal;
