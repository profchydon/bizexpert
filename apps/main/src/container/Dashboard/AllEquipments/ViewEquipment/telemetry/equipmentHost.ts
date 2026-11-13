import type { AssignedContact } from "./assignedContact";
import type { Ownership } from "./types";

export interface EquipmentDetail {
  id: string;
  name: string;
  serial: string;
  type: string;
  assignee: string;
  officeId?: string;
  source?: string;
  ownership?: Ownership;
  contact: AssignedContact | null;
}
