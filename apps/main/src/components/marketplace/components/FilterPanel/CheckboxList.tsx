export interface CheckboxListOption {
  value: string;
  label: string;
}

export interface CheckboxListProps {
  name: string;
  options: CheckboxListOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const CheckboxList = ({
  name,
  options,
  selected,
  onChange,
}: CheckboxListProps) => (
  <div className="mp-flex mp-flex-col mp-gap-1">
    {options.map((option) => {
      const checked = selected.includes(option.value);
      const id = `${name}-${option.value}`;

      return (
        <label
          key={option.value}
          htmlFor={id}
          className="mp-flex mp-items-center mp-gap-3 mp-py-2 mp-text-sm mp-font-medium mp-text-gray-700 mp-cursor-pointer"
        >
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={() =>
              onChange(
                checked
                  ? selected.filter((value) => value !== option.value)
                  : [...selected, option.value],
              )
            }
            className="mp-h-4 mp-w-4 mp-rounded mp-border-gray-300 mp-text-[var(--mp-primary,#085DE8)] focus:mp-ring-[var(--mp-primary,#085DE8)]"
          />
          {option.label}
        </label>
      );
    })}
  </div>
);
