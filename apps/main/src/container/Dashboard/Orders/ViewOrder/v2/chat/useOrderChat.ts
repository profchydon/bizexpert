import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { useGetOrderMessagesQuery } from "@/api/baseQueries/companiesApi/ordersApi/getOrderMessages";
import { useSendOrderMessageMutation } from "@/api/baseQueries/companiesApi/ordersApi/sendOrderMessage";
import { useEditOrderMessageMutation } from "@/api/baseQueries/companiesApi/ordersApi/editOrderMessage";
import { useMarkOrderMessagesReadMutation } from "@/api/baseQueries/companiesApi/ordersApi/markOrderMessagesRead";
import { mapMessages } from "./mapMessages";
import { canAccessOrderChat } from "./chatAccess";

const BASE_POLL = 10000;
const BURST_POLL = 3000;
const BURST_DURATION = 15000;

interface UseOrderChatArgs {
  orderId: string;
  companyId?: string;
  activeTab: string;
}

export function useOrderChat({
  orderId,
  companyId,
  activeTab,
}: UseOrderChatArgs) {
  const { getUserDetails } = useAuthUserDetail();
  const canAccess = canAccessOrderChat(getUserDetails());

  const [pollInterval, setPollInterval] = useState(BASE_POLL);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [sendMutation, { isLoading: isSending }] =
    useSendOrderMessageMutation();
  const [editMutation] = useEditOrderMessageMutation();
  const [markReadMutation] = useMarkOrderMessagesReadMutation();

  const skip = !companyId || !orderId || !canAccess;
  const { data, isLoading, isError } = useGetOrderMessagesQuery(
    { companyId: companyId as string, orderId },
    { skip, pollingInterval: isSending ? 0 : pollInterval },
  );

  const chatMessages = useMemo(() => mapMessages(data?.data ?? []), [data]);
  const unreadChatCount = data?.thread_state?.unread_count ?? 0;
  const latestId = data?.thread_state?.latest_message_id ?? null;

  const markedRef = useRef<string | null>(null);
  const markChatRead = useCallback(() => {
    if (skip || !latestId || unreadChatCount <= 0) return;
    if (markedRef.current === latestId) return;
    markedRef.current = latestId;
    markReadMutation({ companyId: companyId as string, orderId });
  }, [skip, latestId, unreadChatCount, companyId, orderId, markReadMutation]);

  useEffect(() => {
    if (activeTab === "chat") markChatRead();
  }, [activeTab, markChatRead]);

  const startBurst = useCallback(() => {
    setPollInterval(BURST_POLL);
    if (burstTimer.current) clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(
      () => setPollInterval(BASE_POLL),
      BURST_DURATION,
    );
  }, []);

  useEffect(
    () => () => {
      if (burstTimer.current) clearTimeout(burstTimer.current);
    },
    [],
  );

  const sendMessage = useCallback(
    (text: string, files?: File[], quotedMessageId?: string) => {
      if (skip) return;
      sendMutation({
        companyId: companyId as string,
        orderId,
        body: text || undefined,
        quoted_message_id: quotedMessageId,
        attachments: files?.length ? files : undefined,
      })
        .unwrap()
        .catch(() =>
          displayErrorMessage("Couldn't send message", "Please try again."),
        );
      startBurst();
    },
    [skip, companyId, orderId, sendMutation, startBurst],
  );

  const editMessage = useCallback(
    (messageId: string, body: string): Promise<boolean> => {
      if (skip) return Promise.resolve(false);
      return editMutation({
        companyId: companyId as string,
        orderId,
        messageId,
        body,
      })
        .unwrap()
        .then(() => true)
        .catch(() => {
          displayErrorMessage("Couldn't edit message", "Please try again.");
          return false;
        });
    },
    [skip, companyId, orderId, editMutation],
  );

  return {
    canAccess,
    chatMessages,
    isLoading,
    isError,
    unreadChatCount,
    markChatRead,
    sendMessage,
    editMessage,
  };
}
