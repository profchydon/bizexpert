export type FeedItem = {
  id: string;
  initials: string;
  type: "logo" | "order" | "suborder" | "initials" | "image";
  imageUrl?: string;
  isLast?: boolean;
  title: string;
  time: string;
  description?: string;
  action?: string;
  highlight?: string;
  description2?: string;
  showUnreadDot?: boolean;
  badge?: {
    label: string;
    style: string;
  };
  message?: string;
  attachment?: {
    name: string;
    size?: string;
    extension?: string;
  };
};
