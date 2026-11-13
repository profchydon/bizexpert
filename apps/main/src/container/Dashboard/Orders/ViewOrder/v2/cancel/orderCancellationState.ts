import type { CancellationPreviewResponse } from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";
import type {
  CancellationReasonId,
  CancellationScope,
} from "@/utils/order-cancellation";
import type { CancelEmpRow } from "./cancelData";
import type { CancelIntent, OpenCancelInput } from "./cancelTypes";
import {
  type CancellationView,
  type deriveCancellationInfo,
} from "./mapCancellationInfo";

export interface OrderCancellationState {
  isPreAccept: boolean;
  canCancel: boolean;
  isLive: boolean;
  cutoffMessage: string | null;
  canCancelSubOrder: (employee: CancelEmpRow) => boolean;
  hasUncancellableDevices: boolean;
  view: CancellationView;
  info: ReturnType<typeof deriveCancellationInfo>;
  employees: CancelEmpRow[];
  totalItems: number;
  intent: CancelIntent | null;
  openCancelModal: (input?: OpenCancelInput) => void;
  closeCancelModal: () => void;
  submitCancellation: (input: {
    scope: CancellationScope;
    reasonId: CancellationReasonId;
    details: string;
    employeeIds?: string[];
    suborderIds?: string[];
  }) => Promise<{
    ok: boolean;
    instant?: boolean;
    refund_preview?: CancellationPreviewResponse["refund_preview"];
  }>;
  withdrawCancellation: () => Promise<void>;
  isSubmitting: boolean;
  isWithdrawing: boolean;
}
