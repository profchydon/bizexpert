"use client";

import { useState } from "react";

export function useCatalogRuleDetailOverlays() {
  const [activateOpen, setActivateOpen] = useState(false);
  const [activationBlockedOpen, setActivationBlockedOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [kitConfigOpen, setKitConfigOpen] = useState(false);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [limitsDrawerOpen, setLimitsDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return {
    state: {
      activateOpen,
      activationBlockedOpen,
      editOpen,
      kitConfigOpen,
      configureOpen,
      limitsOpen,
      limitsDrawerOpen,
      deleteOpen,
    },
    setters: {
      setActivateOpen,
      setActivationBlockedOpen,
      setEditOpen,
      setKitConfigOpen,
      setConfigureOpen,
      setLimitsOpen,
      setLimitsDrawerOpen,
      setDeleteOpen,
    },
  };
}
