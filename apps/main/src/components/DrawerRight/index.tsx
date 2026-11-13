"use client";

import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Drawer from "react-modern-drawer";
import { cn } from "@/lib/utils";
import { releaseBodyScrollLock } from "@/utils/releaseBodyScrollLock";
import { Button } from "../ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  isSaveButtonDisabled?: boolean;
  isSaveLoading?: boolean;
  saveText?: string | React.ReactNode;
  onCancel: () => void;
  cancelText?: string | React.ReactNode;
  drawerTitle?: string;
  drawerDescription?: React.ReactNode;
  headerIcon?: React.ReactNode;
  enableOverlay?: boolean;
  width?: string;
  minWidth?: string;
  addSecondaryButton?: React.ReactNode;
  hideSaveButton?: boolean;
  hideDefaultFooterBtn?: boolean;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
  hideTitle?: boolean;
  hideDescription?: boolean;
  className?: string;
  customFooter?: React.ReactNode;
  zIndex?: number;
}

const DrawerRight: React.FC<React.PropsWithChildren<Props>> = ({
  isOpen,
  onClose,
  children,
  onCancel,
  onSave,
  hideSaveButton = false,
  isSaveButtonDisabled = false,
  isSaveLoading = false,
  drawerTitle,
  drawerDescription,
  headerIcon,
  cancelText = "Cancel",
  saveText = "Save",
  enableOverlay = false,
  width,
  minWidth,
  addSecondaryButton,
  hideDefaultFooterBtn = false,
  hideHeader = false,
  hideCloseButton = false,
  hideTitle = false,
  hideDescription = false,
  className,
  customFooter,
  zIndex = 1007,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      if (isOpenRef.current) {
        releaseBodyScrollLock();
      }
    };
  }, []);

  return (
    isMounted && (
      <Drawer
        open={isOpen}
        onClose={onClose}
        direction="right"
        className={cn(
          "flex flex-col border border-t-0 border-gray-200 bg-white shadow-none",
          !width && "w-[335px] md:w-[430px]",
          minWidth && `min-w-[${minWidth}]`,
        )}
        duration={200}
        enableOverlay={enableOverlay}
        zIndex={zIndex}
        style={{
          bottom: 0,
          top: "auto",
          width: width ? `${width}px` : undefined,
        }}
        lockBackgroundScroll
      >
        <div className="flex h-full min-h-0 flex-col">
          {!hideCloseButton && (
            <div className="absolute right-6 top-3 z-20">
              <button
                type="button"
                aria-label="Close drawer"
                onClick={onClose}
                className="text-gray-500 transition-colors hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {!hideHeader && (
            <div className="relative z-10 mb-4 flex shrink-0 items-start gap-3 bg-white px-6 pt-4">
              {headerIcon && (
                <div className="flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
                  {headerIcon}
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1.5">
                {!hideTitle && (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {drawerTitle}
                  </h2>
                )}
                {!hideDescription && drawerDescription}
              </div>
            </div>
          )}

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 pt-5 font-ibmPlexSans",
              className,
            )}
          >
            {children}
          </div>

          {customFooter ? (
            <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
              {customFooter}
            </div>
          ) : (
            !hideDefaultFooterBtn && (
              <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
                {addSecondaryButton ? (
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">{addSecondaryButton}</div>
                    <div className="flex min-w-0 flex-1 gap-3">
                      <Button
                        className="min-w-0 flex-1 text-sm font-semibold"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSaveLoading}
                        data-testid="drawerright-button"
                      >
                        {cancelText}
                      </Button>
                      {!hideSaveButton ? (
                        typeof saveText === "string" ? (
                          <Button
                            className="min-w-0 flex-1 text-sm font-semibold"
                            onClick={onSave}
                            disabled={isSaveButtonDisabled}
                            isLoading={isSaveLoading}
                            data-testid="drawerright-button-2"
                          >
                            {saveText}
                          </Button>
                        ) : (
                          <div className="flex min-w-0 flex-1">{saveText}</div>
                        )
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      className="min-w-0 flex-1 text-sm font-semibold"
                      variant="outline"
                      onClick={onCancel}
                      disabled={isSaveLoading}
                      data-testid="drawerright-button-3"
                    >
                      {cancelText}
                    </Button>
                    {!hideSaveButton ? (
                      typeof saveText === "string" ? (
                        <Button
                          className="min-w-0 flex-1 text-sm font-semibold"
                          onClick={onSave}
                          disabled={isSaveButtonDisabled}
                          isLoading={isSaveLoading}
                          data-testid="drawerright-button-4"
                        >
                          {saveText}
                        </Button>
                      ) : (
                        <div className="flex min-w-0 flex-1">{saveText}</div>
                      )
                    ) : null}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </Drawer>
    )
  );
};

export default DrawerRight;
