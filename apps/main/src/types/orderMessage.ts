export interface OrderMessageSender {
  type?: string | null;
  id?: string | null;
  name?: string | null;
}

export interface OrderMessageAttachment {
  id: string;
  type: "file" | "link";
  url?: string | null;
  title?: string | null;
  mime_type?: string | null;
  size?: number | null;
}

export interface OrderMessageQuote {
  id: string;
  body?: string | null;
  sender?: OrderMessageSender | null;
}

export interface OrderMessage {
  id: string;
  order_id?: string;
  conversation_type?: string;
  body?: string | null;
  is_edited?: boolean;
  edited_at?: string | null;
  sender?: OrderMessageSender | null;
  quoted_message?: OrderMessageQuote | null;
  attachments?: OrderMessageAttachment[];
  created_at: string;
}

export interface OrderMessageThreadState {
  latest_message_id?: string | null;
  message_count?: number;
  read_count?: number;
  unread_count?: number;
  last_read_message_id?: string | null;
  last_read_at?: string | null;
}

export interface OrderMessagesPage {
  data: OrderMessage[];
  thread_state?: OrderMessageThreadState;
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

export interface SendOrderMessageLink {
  url: string;
  title?: string;
}

export interface SendOrderMessagePayload {
  body?: string;
  quoted_message_id?: string;
  attachments?: File[];
  links?: SendOrderMessageLink[];
}

export interface EditOrderMessagePayload {
  body: string;
}
