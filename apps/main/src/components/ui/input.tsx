import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue"
  > {
  value?: React.InputHTMLAttributes<HTMLInputElement>["value"] | null;
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>["value"] | null;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startAdornment,
      endAdornment,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<
      React.InputHTMLAttributes<HTMLInputElement>["value"]
    >(defaultValue === null || defaultValue === undefined ? "" : defaultValue);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (!isControlled) {
        setUncontrolledValue(event.target.value);
      }
      onChange?.(event);
    };

    const inputValue = isControlled
      ? value === null
        ? ""
        : value
      : uncontrolledValue;

    return (
      <div className="relative flex items-center w-full">
        {startAdornment && (
          <div className="absolute left-3 border-r pr-2">{startAdornment}</div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-[44px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            startAdornment ? "pl-14" : "",
            endAdornment ? "pr-14" : "",
            className,
          )}
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />
        {endAdornment && (
          <div className="absolute border-l pl-2 right-3">{endAdornment}</div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
