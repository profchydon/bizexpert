"use client";

import { useState } from "react";
import { useStorageServerCart } from "../../hooks/useStorageServerCart";
import { StorageActionCartSlideout } from "./StorageActionCartSlideout";
import { StorageCheckoutBar } from "./StorageCheckoutBar";

export function StoragePageCartSection() {
  const { items } = useStorageServerCart();
  const count = items.length;
  const [open, setOpen] = useState(false);

  return (
    <>
      <StorageCheckoutBar count={count} onReview={() => setOpen(true)} />
      <StorageActionCartSlideout
        items={items}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
