export interface IActivityItem {
  id: string;
  userInitials: string;
  userName: string;
  action: string;
  details: string;
  equipment?: string;
  assigneeName?: string;
  timestamp: string;
  note?: string;
  attachment?: {
    name: string;
    size?: string;
    type: "pdf" | "png" | "jpg" | undefined;
  };
  link?: string;
}

export interface RawActivity {
  id: string;
  event_type: string;
  event_date: string;
  equipment: string;
  actor: string | null;
  payload: any;
  assignee: {
    id: string;
    name: string;
  } | null;
}
