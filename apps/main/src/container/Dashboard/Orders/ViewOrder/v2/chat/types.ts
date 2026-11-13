export interface ChatLink {
  url: string;
  title: string;
  description?: string;
}

export interface ChatFile {
  name: string;
  size: string;
  ext: string;
  url?: string;
  isImage?: boolean;
}

export interface ChatReplyRef {
  id: string;
  senderName: string;
  message: string;
  file?: ChatFile;
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "rayda";
  senderName: string;
  message: string;
  timestamp: string;
  epoch: number;
  isOptimistic?: boolean;
  links?: ChatLink[];
  replyTo?: ChatReplyRef;
  edited?: boolean;
  files?: ChatFile[];
}
