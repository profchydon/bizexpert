export type BadgeVariant =
  | "destructive"
  | "pending"
  | "default"
  | "gray"
  | "blue"
  | "success";

export type AvatarType = "initials" | "image" | "icon";

export type ActionTitleColor = "blue" | "red" | "default";

export type UnifiedActivity = {
  id: string;
  type: string;
  headerTitle: string;
  actionTitle: string;
  actionTitleColor: ActionTitleColor;
  message: string;
  badge?: {
    text: string;
    variant: BadgeVariant;
  };
  avatar: {
    type: AvatarType;
    value: string;
    imageUrl?: string;
  };
  timestamp: string;
  comment?: string;
  subOrderInfo?: {
    id: string;
    orderNumber?: string;
    employeeName?: string;
  };
  equipmentInfo?: {
    id: string;
    title: string;
    imageUrl?: string;
  };
  link?: {
    text: string;
    href?: string;
  };
};
