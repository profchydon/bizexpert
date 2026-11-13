"use client";

import { toast } from "sonner";
import { CircleCheck, X } from "lucide-react";

const displaySuccessMessage = (message: string, description?: string) => {
  const toastId = toast(
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
          alignItems: "center",
          gridTemplateColumns: "auto auto 1fr",
        }}
      >
        <CircleCheck style={{ color: "#039855" }} />
        <span
          style={{
            color: "#027A48",
            fontWeight: 600,
            fontSize: "14px",
            marginLeft: "12px",
          }}
        >
          {message}
        </span>
        <X
          style={{ color: "#12B76A" }}
          className="justify-self-end cursor-pointer"
          onClick={() => dismissToast()}
        />
      </div>

      {description && (
        <span
          style={{
            color: "#027A48",
            fontWeight: "400",
            fontSize: "14px",
            marginLeft: "30px",
          }}
        >
          {description}
        </span>
      )}
    </div>,

    {
      style: {
        background: "#F6FEF9",
        border: "1px solid #6CE9A6",
      },
    },
  );
  const dismissToast = () => toast.dismiss(toastId);
  return toastId;
};

export default displaySuccessMessage;
