import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  id: string;
  placeholder: string;
  searchPlaceholder: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export default function SearchableSelect({
  id,
  placeholder,
  searchPlaceholder,
  value,
  options,
  onChange,
}: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const selected = options.find((option) => option.value === value);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && triggerRef.current) {
      setContentWidth(triggerRef.current.offsetWidth);
    }
    setOpen(nextOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-[44px] w-full justify-between font-normal",
            !selected && "text-gray-500",
          )}
          data-testid="searchableselect-button"
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={contentWidth ? { width: contentWidth } : undefined}
        className="z-[100010] w-auto max-w-[calc(100vw-2rem)] p-0"
      >
        <Command className="max-w-full">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="max-h-60 overflow-x-hidden">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="overflow-hidden">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  className="overflow-hidden"
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {option.label}
                  </span>
                  {value === option.value ? (
                    <Check className="ml-2 h-4 w-4 shrink-0 text-primary-600" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
