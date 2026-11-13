"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { navBarIconButtonClass } from "./navBarIconButtonClass";

const NavSearchButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        data-testid="navbar-search-button"
        className={navBarIconButtonClass}
        onClick={() => setIsOpen(true)}
      >
        <Search className="size-5" strokeWidth={1.75} />
      </button>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        data-testid="navsearchbutton-dialog"
      >
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search employees, devices, and marketplace items.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
            <Search
              className="size-5 shrink-0 text-gray-400"
              strokeWidth={1.75}
            />
            <Input
              autoFocus
              placeholder="Search employees and devices..."
              className="border-0 px-0 shadow-none focus-visible:ring-0"
              data-testid="navsearchbutton-input"
            />
            <button
              type="button"
              aria-label="Close search"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            Start typing to search employees and devices.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavSearchButton;
