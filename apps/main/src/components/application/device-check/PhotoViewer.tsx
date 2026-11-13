"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, XClose } from "@untitledui/icons";
import { Button as AriaButton } from "react-aria-components";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { SafeImage } from "@/components/SafeImage";
import {
  ELEVATED_MODAL_CONTENT_CLASS,
  ELEVATED_MODAL_OVERLAY_CLASS,
} from "@/utils/drawerOverlayStacking";
import { cx } from "@/utils/cx";

interface Props {
  photos: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
}

export function PhotoViewer({ photos, isOpen, initialIndex, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setIdx(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setIdx((i) => Math.min(photos.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, photos.length]);

  if (!photos.length) return null;
  const current = Math.min(idx, photos.length - 1);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className={ELEVATED_MODAL_OVERLAY_CLASS}
    >
      <Modal className={cx("max-w-3xl", ELEVATED_MODAL_CONTENT_CLASS)}>
        <Dialog data-testid="photoviewer-dialog">
          <div className="flex w-full flex-col overflow-hidden rounded-xl bg-primary shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-secondary px-5 py-3">
              <span className="text-sm font-semibold text-primary">
                Device check photos
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-tertiary">
                  {current + 1} of {photos.length}
                </span>
                <ButtonUtility
                  size="sm"
                  color="tertiary"
                  icon={XClose}
                  aria-label="Close"
                  onClick={onClose}
                />
              </div>
            </div>
            <div className="relative flex min-h-[40dvh] items-center justify-center bg-secondary_alt p-4 sm:min-h-[56dvh]">
              <SafeImage
                src={photos[current]}
                alt={`Device check photo ${current + 1}`}
                width={960}
                height={720}
                className="max-h-[60dvh] w-auto rounded-lg object-contain"
              />
              {current > 0 && (
                <div className="absolute top-1/2 left-3 -translate-y-1/2">
                  <ButtonUtility
                    size="sm"
                    color="secondary"
                    icon={ChevronLeft}
                    aria-label="Previous photo"
                    onClick={() => setIdx(current - 1)}
                  />
                </div>
              )}
              {current < photos.length - 1 && (
                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                  <ButtonUtility
                    size="sm"
                    color="secondary"
                    icon={ChevronRight}
                    aria-label="Next photo"
                    onClick={() => setIdx(current + 1)}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto border-t border-secondary p-3">
              {photos.map((p, i) => (
                <AriaButton
                  key={p}
                  onPress={() => setIdx(i)}
                  aria-label={`View photo ${i + 1}`}
                  className="shrink-0 rounded-md outline-hidden"
                >
                  <SafeImage
                    src={p}
                    alt=""
                    width={56}
                    height={56}
                    className={cx(
                      "size-14 rounded-md object-cover ring-1 transition",
                      i === current
                        ? "ring-2 ring-brand"
                        : "ring-secondary hover:ring-brand",
                    )}
                  />
                </AriaButton>
              ))}
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
