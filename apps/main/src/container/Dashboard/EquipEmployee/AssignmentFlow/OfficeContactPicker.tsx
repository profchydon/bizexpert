import type { Key } from "react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { getInitials } from "@/utils/getInitials";
import type { OfficeDeliveryContact } from "@/api/baseQueries/companiesApi/officesApi/getDeliveryContacts";
import { contactSourceFor, type OfficeContact } from "./officeContactRules";

interface OfficeContactPickerProps {
  contacts: OfficeDeliveryContact[];
  contactEmployeeId: string;
  officeDefault?: OfficeContact | null;
  placeholder?: string;
  ariaLabel?: string;
  onSelect: (contact: OfficeContact) => void;
}

function contactName(contact: OfficeDeliveryContact): string {
  return [contact.first_name, contact.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function contactSupportingText(
  contact: OfficeDeliveryContact,
): string | undefined {
  const role = contact.job_title?.trim() || undefined;
  if (!contact.is_office_admin) return role;
  return [role, "Office admin"].filter(Boolean).join(" · ");
}

const OfficeContactPicker: React.FC<OfficeContactPickerProps> = ({
  contacts,
  contactEmployeeId,
  placeholder = "Delivery contact",
  ariaLabel = "Received by",
  onSelect,
}) => {
  const selected = contacts.find((contact) => contact.id === contactEmployeeId);
  const items = contacts.map((contact) => {
    const name = contactName(contact);
    return {
      id: contact.id,
      label: name,
      initials: getInitials(name) || undefined,
      supportingText: contactSupportingText(contact),
    };
  });

  return (
    <Select.ComboBox
      aria-label={ariaLabel}
      placeholder={placeholder}
      size="sm"
      shortcut={false}
      icon={
        selected ? (
          <Avatar
            size="xs"
            initials={getInitials(contactName(selected)) ?? undefined}
          />
        ) : undefined
      }
      items={items}
      selectedKey={contactEmployeeId || null}
      onSelectionChange={(key: Key | null) => {
        const contact = contacts.find(
          (candidate) => candidate.id === String(key),
        );
        if (!contact) return;
        onSelect({
          contactEmployeeId: contact.id,
          contactEmployeeName: contactName(contact),
        });
      }}
      hideSelectedSupportingText
      className="w-full"
      popoverClassName="min-w-[280px]"
    >
      {(item) => <SelectItem key={item.id} {...item} />}
    </Select.ComboBox>
  );
};

export function sourceForPickedContact(
  pickedId: string,
  officeDefault: OfficeContact | null | undefined,
) {
  return contactSourceFor(pickedId, officeDefault);
}

export default OfficeContactPicker;
