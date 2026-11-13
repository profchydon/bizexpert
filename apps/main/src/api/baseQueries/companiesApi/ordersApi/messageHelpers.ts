import type {
  OrderMessage,
  OrderMessageAttachment,
  OrderMessagesPage,
  SendOrderMessagePayload,
} from "@/types/orderMessage";

export function buildMessageFormData(
  payload: SendOrderMessagePayload,
): FormData {
  const formData = new FormData();
  if (payload.body) formData.append("body", payload.body);
  if (payload.quoted_message_id)
    formData.append("quoted_message_id", payload.quoted_message_id);
  payload.attachments?.forEach((file) =>
    formData.append("attachments[]", file),
  );
  payload.links?.forEach((link, index) => {
    formData.append(`links[${index}][url]`, link.url);
    if (link.title) formData.append(`links[${index}][title]`, link.title);
  });
  return formData;
}

export function quotedFrom(
  messages: OrderMessage[],
  quotedMessageId?: string,
): OrderMessage["quoted_message"] {
  const source = quotedMessageId
    ? messages.find((m) => m.id === quotedMessageId)
    : undefined;
  return source
    ? { id: source.id, body: source.body, sender: source.sender }
    : null;
}

export function buildOptimisticMessage(
  payload: SendOrderMessagePayload,
  quoted: OrderMessage["quoted_message"],
  objectUrls: string[],
): OrderMessage {
  const stamp = Date.now();
  const attachments: OrderMessageAttachment[] = (payload.attachments ?? []).map(
    (file, i): OrderMessageAttachment => {
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      return {
        id: `optimistic-file-${stamp}-${i}`,
        type: "file",
        url,
        title: file.name,
        mime_type: file.type || null,
        size: file.size,
      };
    },
  );

  return {
    id: `optimistic-${stamp}`,
    sender: { type: "User", name: "You" },
    body: payload.body ?? "",
    quoted_message: quoted ?? null,
    attachments,
    is_edited: false,
    edited_at: null,
    created_at: new Date().toISOString(),
  };
}

export function scheduleObjectUrlCleanup(objectUrls: string[]): void {
  if (objectUrls.length) {
    setTimeout(
      () => objectUrls.forEach((url) => URL.revokeObjectURL(url)),
      30000,
    );
  }
}

export function unwrapMessagesPage(
  response: ServerResponse<OrderMessagesPage> | OrderMessagesPage,
): OrderMessagesPage {
  const wrapped = response as ServerResponse<OrderMessagesPage>;
  const inner = wrapped?.data as OrderMessagesPage | undefined;
  if (inner && Array.isArray(inner.data)) return inner;
  const direct = response as OrderMessagesPage;
  return { ...direct, data: Array.isArray(direct?.data) ? direct.data : [] };
}
