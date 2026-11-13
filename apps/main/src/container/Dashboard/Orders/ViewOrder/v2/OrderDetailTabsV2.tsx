import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IOrder, ISubOrder } from "@/types/orders";
import { cn } from "@/lib/utils";
import OrderInformationTable from "../OrderInformationTable";
import OrderUpdates from "../OrderUpdates";
import OrderContentsV2 from "./OrderContentsV2";
import OffboardContentsV2 from "./OffboardContentsV2";
import { OrderChatPanel } from "./chat/OrderChatPanel";
import { useOrderChat } from "./chat/useOrderChat";
import StorageDestinationCardV2 from "./StorageDestinationCardV2";
import OrderInfoTableV2 from "./table/OrderInfoTableV2";
import { isStorageOrderType } from "./orderSidebarFields";
import { normalizeNoteIndex } from "../normalizeNoteIndex";
import { getSubOrders } from "./orderContentLines";

type DetailTab = "information" | "contents" | "updates" | "chat";

const TABS: { key: DetailTab; label: string }[] = [
  { key: "information", label: "Order information" },
  { key: "contents", label: "Order contents" },
  { key: "updates", label: "Order updates" },
  { key: "chat", label: "Chat" },
];

const TAB_PARAM_MAP: Record<string, DetailTab> = {
  info: "information",
  information: "information",
  notes: "information",
  contents: "contents",
  updates: "updates",
  chat: "chat",
};

function resolveInitialTab(param?: string | null): DetailTab {
  return (param && TAB_PARAM_MAP[param]) || "information";
}

interface Props {
  order: IOrder;
  orderCompanyId?: string;
  canUpdateSignature?: boolean;
  selectedExternalRows: Record<string, boolean>;
  selectedRows: ISubOrder[];
  onSelectedRowsChange: (rows: ISubOrder[]) => void;
  onMakeSignatureRequired?: () => void;
  onRemoveSignatureRequired?: () => void;
  pendingVerificationCount?: number;
  onVerifyAddress?: (item: ISubOrder) => void;
  onVerifyAllPending?: () => void;
  onBulkCancel?: (suborderIds: string[]) => void;
  onCancelSubOrder?: (subOrder: ISubOrder) => void;
  chatHeight?: number;
}

const TabBadge: React.FC<{ count: number }> = ({ count }) => (
  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error-100 px-1 text-xs font-medium text-error-700">
    {count}
  </span>
);

const OrderDetailTabsV2: React.FC<Props> = ({
  order,
  orderCompanyId,
  chatHeight,
  ...tableProps
}) => {
  const searchParams = useSearchParams();
  const deepLinkTab = searchParams?.get("tab");
  const deepLinkSubOrderId = searchParams?.get("suborder_id");
  const deepLinkNoteIndexParam = searchParams?.get("noteIndex");
  const isStorage = isStorageOrderType(order.type);
  const isEmployeeTable =
    order.type === "onboarding" || order.type === "offboarding";
  const [activeTab, setActiveTab] = useState<DetailTab>(() =>
    resolveInitialTab(searchParams?.get("tab")),
  );
  const chat = useOrderChat({
    orderId: order.id,
    companyId: orderCompanyId,
    activeTab,
  });
  const { markChatRead, canAccess: canAccessChat } = chat;

  const focusedNoteIndex = useMemo(() => {
    if (deepLinkTab !== "notes") {
      return null;
    }

    const matchedSubOrder = getSubOrders(order).find(
      (item) => !deepLinkSubOrderId || item.id === deepLinkSubOrderId,
    );
    const notesLength = Array.isArray(
      (matchedSubOrder as { note?: unknown[] })?.note,
    )
      ? ((matchedSubOrder as { note: unknown[] }).note?.length ?? 0)
      : 0;

    return normalizeNoteIndex(deepLinkNoteIndexParam, notesLength);
  }, [deepLinkTab, deepLinkSubOrderId, deepLinkNoteIndexParam, order]);

  const visibleTabs = TABS.filter((tab) => tab.key !== "chat" || canAccessChat);
  const effectiveTab: DetailTab =
    activeTab === "chat" && !canAccessChat ? "information" : activeTab;

  const handleTabClick = (key: DetailTab) => {
    setActiveTab(key);
    if (key === "chat") markChatRead();
  };

  const renderContents = () =>
    order.type === "offboarding" ? (
      <OffboardContentsV2 order={order} />
    ) : (
      <OrderContentsV2 order={order} />
    );

  const renderInformation = () => {
    if (isStorage) {
      return (
        <StorageDestinationCardV2
          order={order}
          subOrderId={deepLinkSubOrderId}
          focusedNoteIndex={focusedNoteIndex}
        />
      );
    }
    if (isEmployeeTable) {
      return (
        <OrderInfoTableV2
          order={order}
          canUpdateSignature={tableProps.canUpdateSignature}
          selectedRows={tableProps.selectedRows}
          onSelectedRowsChange={tableProps.onSelectedRowsChange}
          onMakeSignatureRequired={tableProps.onMakeSignatureRequired}
          onRemoveSignatureRequired={tableProps.onRemoveSignatureRequired}
          pendingVerificationCount={tableProps.pendingVerificationCount}
          onVerifyAddress={tableProps.onVerifyAddress}
          onVerifyAllPending={tableProps.onVerifyAllPending}
          onBulkCancel={tableProps.onBulkCancel}
          onCancelSubOrder={tableProps.onCancelSubOrder}
        />
      );
    }
    return <OrderInformationTable order={order} {...tableProps} />;
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
      <div className="flex overflow-x-auto border-b border-gray-200">
        {visibleTabs.map(({ key, label }, index) => {
          const badge = key === "chat" ? chat.unreadChatCount : 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTabClick(key)}
              className={cn(
                "relative flex items-center gap-2 px-1 pb-3 text-base font-semibold transition-colors",
                index > 0 && "ml-6",
                effectiveTab === key
                  ? "text-primary-700"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {label}
              {badge > 0 && <TabBadge count={badge} />}
              {effectiveTab === key && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary-600" />
              )}
            </button>
          );
        })}
      </div>

      {effectiveTab === "chat" ? (
        <div
          className="flex min-h-[600px] flex-1 flex-col"
          style={
            chatHeight ? { minHeight: Math.max(chatHeight, 600) } : undefined
          }
        >
          <OrderChatPanel
            messages={chat.chatMessages}
            isLoading={chat.isLoading}
            onSend={chat.sendMessage}
            onEditSave={chat.editMessage}
            onFirstView={markChatRead}
          />
        </div>
      ) : (
        <div className="min-w-0 overflow-x-hidden overflow-y-auto">
          {effectiveTab === "information" && renderInformation()}
          {effectiveTab === "contents" && renderContents()}
          {effectiveTab === "updates" && <OrderUpdates order={order} />}
        </div>
      )}
    </div>
  );
};

export default OrderDetailTabsV2;
