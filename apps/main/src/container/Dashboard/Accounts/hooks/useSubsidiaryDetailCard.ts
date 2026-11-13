"use client";

import { useState } from "react";
import routes from "@/routes";
import type { Subsidiary } from "../types";
import { useEntityCardCapture } from "./useEntityCardCapture";
import type { BannerAction } from "../components/SubsidiaryStatusBanner";

export function useSubsidiaryDetailCard(
  subsidiary: Pick<Subsidiary, "id" | "name" | "cardOnFile">,
  setOverride: (override: Partial<Subsidiary>) => void,
) {
  const { beginCardCapture, beginCardReplace, isCapturing } =
    useEntityCardCapture();
  const [replaceCardOpen, setReplaceCardOpen] = useState(false);
  const [bannerAction, setBannerAction] = useState<BannerAction | null>(null);

  async function handleBannerResolve(resolved: BannerAction) {
    if (resolved === "card-capture") {
      const outcome = await beginCardCapture({
        entityId: subsidiary.id,
        name: subsidiary.name,
        returnPath: routes.SUBSIDIARY_DETAIL(subsidiary.id),
      });
      if (outcome !== "redirect") setBannerAction(null);
      return;
    }

    if (resolved === "settle-invoice") {
      setOverride({ status: "operational" });
    }
    setBannerAction(null);
  }

  async function handleReplaceCard() {
    const input = {
      entityId: subsidiary.id,
      name: subsidiary.name,
      returnPath: routes.SUBSIDIARY_DETAIL(subsidiary.id),
    };

    if (subsidiary.cardOnFile) {
      await beginCardReplace(input);
      return;
    }

    await beginCardCapture(input);
  }

  return {
    isCapturing,
    replaceCardOpen,
    setReplaceCardOpen,
    bannerAction,
    setBannerAction,
    handleBannerResolve,
    handleReplaceCard,
  };
}
