"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import SearchWithIcon from "@/components/SearchWithIcon";
import { trackItemSearchRowClass } from "./trackItemPageClasses";

type Props = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
};

export function TrackItemSearch({
  value,
  isLoading,
  onChange,
  onSubmit,
}: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={trackItemSearchRowClass}>
      <SearchWithIcon
        className="flex-1"
        value={value}
        placeholder="Scan or search barcode, SKU, or product name"
        onChange={(event) => onChange(event.target.value)}
      />
      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        disabled={!value.trim()}
      >
        Track
      </Button>
    </form>
  );
}
