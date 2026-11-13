import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  preflightConfirmFieldWrapClass,
  preflightConfirmHintClass,
  preflightConfirmInputClass,
  preflightConfirmLabelClass,
} from "./preflightModalClasses";

interface Props {
  confirmSlug: string;
  value: string;
  onChange: (value: string) => void;
}

export function ConfirmNameField({ confirmSlug, value, onChange }: Props) {
  return (
    <div className={preflightConfirmFieldWrapClass}>
      <Label
        htmlFor="close-entity-confirm"
        className={preflightConfirmLabelClass}
      >
        {`Type ${confirmSlug} to confirm`}
      </Label>
      <Input
        id="close-entity-confirm"
        placeholder={confirmSlug}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        spellCheck={false}
        className={preflightConfirmInputClass}
        data-testid="confirmnamefield-input"
      />
      <p className={preflightConfirmHintClass}>
        Replace spaces with dashes. This is not case sensitive.
      </p>
    </div>
  );
}
