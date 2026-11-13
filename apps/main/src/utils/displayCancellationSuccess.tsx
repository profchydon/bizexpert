"use client";

import { toast } from "sonner";
import { CircleCheck, X } from "lucide-react";
import { cancellationSuccessCopy } from "./cancellationSuccessCopy";

const displayCancellationSuccess = (
  instant = false,
  refundStatus?: string | null,
) => {
  const copy = cancellationSuccessCopy(instant, refundStatus);
  const toastId = toast(
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <CircleCheck
            style={{ color: "#039855", flexShrink: 0, marginTop: "2px" }}
            size={20}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                color: "#027A48",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {copy.title}
            </span>
            <span
              style={{
                color: "#344054",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              {copy.body}
            </span>
          </div>
        </div>
        <X
          style={{ color: "#667085", flexShrink: 0, cursor: "pointer" }}
          size={20}
          onClick={() => dismissToast()}
        />
      </div>

      <span
        style={{
          color: "#027A48",
          fontWeight: 600,
          fontSize: "14px",
          marginLeft: "32px",
          cursor: "pointer",
        }}
        onClick={() => dismissToast()}
      >
        Dismiss
      </span>
    </div>,

    {
      style: {
        background: "#F6FEF9",
        border: "1px solid #6CE9A6",
        width: "480px",
        maxWidth: "100%",
      },
      duration: 10000,
    },
  );
  const dismissToast = () => toast.dismiss(toastId);
  return toastId;
};

export default displayCancellationSuccess;
