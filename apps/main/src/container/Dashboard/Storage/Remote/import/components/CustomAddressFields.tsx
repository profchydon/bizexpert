import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import type { ImportCollection } from "../types";

interface Props {
  collection: ImportCollection;
  onPatch: (patch: Partial<ImportCollection>) => void;
}

export function CustomAddressFields({ collection, onPatch }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <TextArea
        label="Collection address"
        isRequired
        value={collection.address}
        onChange={(v) => onPatch({ address: v, employeeId: undefined })}
        placeholder="Street, city, postcode, country"
        rows={3}
      />
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[200px] flex-1">
          <Input
            label="Contact name"
            isRequired
            value={collection.contactName}
            onChange={(v) => onPatch({ contactName: v, employeeId: undefined })}
            placeholder="Who should we contact?"
            data-testid="customaddressfields-input"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            label="Contact email"
            isRequired
            type="email"
            value={collection.contactEmail}
            onChange={(v) =>
              onPatch({ contactEmail: v, employeeId: undefined })
            }
            placeholder="name@company.com"
            data-testid="customaddressfields-input-2"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            label="Contact phone"
            isRequired
            value={collection.contactPhone}
            onChange={(v) =>
              onPatch({ contactPhone: v, employeeId: undefined })
            }
            placeholder="+234 801 234 5678"
            data-testid="customaddressfields-input-3"
          />
        </div>
      </div>
    </div>
  );
}
