"use client";

import { useState } from "react";
import { ScrollText } from "lucide-react";
import { NavBarChangelogDialog } from "./NavBarChangelogDialog";
import { navBarIconButtonClass } from "./navBarIconButtonClass";

const NavChangelogButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        title="Changelog"
        aria-label="Open changelog"
        data-testid="navbar-changelog-button"
        className={navBarIconButtonClass}
        onClick={() => setIsOpen(true)}
      >
        <ScrollText className="size-5" strokeWidth={1.75} />
      </button>
      <NavBarChangelogDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default NavChangelogButton;
