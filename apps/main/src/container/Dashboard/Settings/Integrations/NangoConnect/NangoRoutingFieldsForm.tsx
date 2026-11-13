import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NangoRoutingField,
  nangoRoutingFieldsFor,
} from "../nangoRoutingFields";
import { useNangoRoutingOptionsQuery } from "@/api/baseQueries/companiesApi/integrationsApi/nangoIntegrations";
import SearchableSelect from "./SearchableSelect";

type Props = {
  slug: string;
  companyId: string;
  connectionId?: string | null;
  routing: Record<string, string>;
  onRoutingChange: (next: Record<string, string>) => void;
};

export default function NangoRoutingFieldsForm({
  slug,
  companyId,
  connectionId,
  routing,
  onRoutingChange,
}: Props) {
  const fields = nangoRoutingFieldsFor(slug);
  const usesSelect = fields.some((field) => field.inputType === "select");

  const { data, isLoading, isError } = useNangoRoutingOptionsQuery(
    {
      companyId,
      provider: slug,
      connectionId: connectionId ?? "",
    },
    {
      skip: !usesSelect || !connectionId,
    },
  );

  const optionsByField = data?.data ?? {};

  return (
    <>
      {fields.map((field) => (
        <RoutingFieldInput
          key={field.name}
          field={field}
          value={routing[field.name] ?? ""}
          options={optionsByField[field.name] ?? []}
          isLoading={usesSelect && isLoading}
          isError={usesSelect && isError}
          onChange={(value) =>
            onRoutingChange({
              ...routing,
              [field.name]: value,
            })
          }
        />
      ))}
    </>
  );
}

function RoutingFieldInput({
  field,
  value,
  options,
  isLoading,
  isError,
  onChange,
}: {
  field: NangoRoutingField;
  value: string;
  options: Array<{ value: string; label: string }>;
  isLoading: boolean;
  isError: boolean;
  onChange: (value: string) => void;
}) {
  const showSelect = field.inputType === "select" && options.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{field.label}</Label>
      {showSelect ? (
        <SearchableSelect
          id={field.name}
          placeholder={field.placeholder}
          searchPlaceholder={`Search ${field.label.toLowerCase()}...`}
          value={value}
          options={options}
          onChange={onChange}
        />
      ) : (
        <Input
          id={field.name}
          placeholder={
            isLoading
              ? "Loading options..."
              : isError
                ? "Could not load options — enter an id"
                : field.placeholder
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
          data-testid="nangoroutingfieldsform-input"
        />
      )}
    </div>
  );
}
