"use client";

import { toast } from "sonner";
import { CircleX, X } from "lucide-react";
import { isRedundantErrorDescription } from "./extractApiErrorMessage";

let activeToastId: any = null;
export const ERROR_TOAST_DURATION_MS = 10000;

const displayErrorMessage = (message: string, description?: string) => {
  if (activeToastId) {
    return;
  }

  const detail = isRedundantErrorDescription(message, description)
    ? undefined
    : description;

  activeToastId = toast(
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <div
        style={{
          display: "grid",
          alignItems: "start",
          gridTemplateColumns: "auto minmax(0, 1fr) auto",
          columnGap: "12px",
        }}
      >
        <CircleX style={{ color: "#F04438" }} />
        <span
          style={{
            color: "#B42318",
            fontWeight: 600,
            fontSize: "14px",
            overflowWrap: "anywhere",
          }}
        >
          {message}
        </span>
        <X
          style={{ color: "#F04438" }}
          className="justify-self-end cursor-pointer"
          onClick={() => dismissToast()}
        />
      </div>

      {detail && (
        <span
          style={{
            color: "#B42318",
            fontWeight: "400",
            fontSize: "14px",
            marginLeft: "32px",
            overflowWrap: "anywhere",
          }}
        >
          {detail}
        </span>
      )}
    </div>,
    {
      style: {
        background: "#FFFBFA",
        border: "1px solid #FDA29B",
        top: "40px",
      },
      duration: ERROR_TOAST_DURATION_MS,
    },
  );

  const dismissToast = () => {
    toast.dismiss(activeToastId);
    activeToastId = null;
  };

  setTimeout(() => {
    activeToastId = null;
  }, 500);

  return activeToastId;
};

export default displayErrorMessage;
