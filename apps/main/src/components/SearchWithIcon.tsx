import { Search } from "lucide-react";
import React, { ChangeEventHandler, FC } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  value?: string | null;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  placeholder?: string;
}

const SearchWithIcon: FC<Props> = (props) => {
  const { className, value, onChange, name, placeholder } = props;

  return (
    <div
      className={cn(
        "relative flex w-full items-center overflow-hidden rounded-md border border-gray-200 bg-white",
        className,
      )}
    >
      <Search className="pointer-events-none absolute left-4 z-10 h-6 w-6 text-gray-600" />
      <Input
        placeholder={!placeholder ? "Search" : placeholder}
        className="h-full border-0 bg-transparent pl-12 pr-4 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        name={name}
        value={value as string}
        onChange={onChange}
        data-testid="searchwithicon-input"
      />
    </div>
  );
};

export default SearchWithIcon;
