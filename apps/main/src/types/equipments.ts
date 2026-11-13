import { IDeviceRefreshDetails } from "./assetRefresh";
import { ICatalog } from "./catalog";
import { OfficeEntityRef, ServerOfficeArea } from "./offices";

export interface IFileData {
  id: string;
  fileableId: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  link: string;
}

export type EQUIPMENT_TYPE = "Computer" | "Phone" | "Accessories" | "Office";

export type EQUIPMENT_STATE = "Brand New" | "Used";
export type EQUIPMENT_STATUS = "unassigned" | "Assigned";

export interface IAddEquipment {
  id?: any;
  title: string;
  serial_number: string;
  make: string;
  model: string;
  year: string;
  type: EQUIPMENT_TYPE;
  state: EQUIPMENT_STATE;
  assignee?: string;
  country?: string;
  details?: string;
  purchase_date?: string;
  purchase_price: string;
  image?: IFileData;
  imageUrl: string | null;
  description: string;
  status?: EQUIPMENT_STATUS;
}

interface Assignee {
  id?: string;
  name: string;
  email?: string;
  address?: string;
}

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface IEquipment_History {
  id: string;
  event_type: string;
  event_date: string;
  assignee: Assignee | null;
}
export interface IEquipment_Assignee {
  assignee: Assignee | null;
}

export interface IEquipmentDocument {
  id: string;
  name: string;
  url: string;
  date_added: string;
}

export interface IEquipment {
  id?: string;
  title: string;
  year: string;
  assignee: Assignee;
  make: string;
  model: string;
  device_setup?: string;
  state: string;
  source?: string;
  telemetry_ownership?: "company" | "employee" | null;
  country?: string;
  office?: OfficeEntityRef | null;
  office_area?: ServerOfficeArea | null;
  purchase_date: string;
  purchase_price: string;
  type: string;
  currency: Currency;
  hash_code: string;
  asset_order_id?: string | null;
  catalog?: ICatalog | null;
  specs?: any;
  image_url: string;
  serial_number: string;
  other_details: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  history?: IEquipment_History[];
  order_type: string;
  usage_time_in_days: string;
  country_code?: string;
  note?: any;
  score?: number;
  has_missing_information?: boolean;
  usage_duration?: string;
  insurance_expiry_in?: string;
  storage_duration?: string;
  missing_information?: string[];
  documents?: IEquipmentDocument[];
  time_left_before_refresh?: string;
  refresh_details?: IDeviceRefreshDetails;
}

export interface IEquipmentsInStorageByCountry {
  id: string;
  title: string;
  description?: string;
  storage_duration: string;
  moved_to_storage: string;
  expiration_date?: string;
  image_url: null | string;
  serial_number: null | string;
  status: string;
  country: string;
  source?: string;
  actionType?: string;
  specs?: {
    memory?: string;
    storage?: string;
    color?: string;
    processor?: string;
    [key: string]: string | undefined;
  };
}

export interface IItemsInStorageByCountry {
  country: string;
  country_id: string;
  country_code: string;
  total_in_storage: number;
  expiring_soon: number;
  latest_update: string;
}

export interface IItemsInStorage {
  storage_location_count: number;
  items_in_storage_count: number;
  items_in_storage_by_country: IItemsInStorageByCountry[];
}

export type GetEquipmentResponse = ServerResponse<IEquipment>;

export type CreateEquipmentRequest = {
  companyId: string;
  payload: FormData;
};

export type EditEquipmentRequest = {
  companyId: string;
  equipment_id: string;
  payload: FormData;
};

export type UpdateEquipmentAssigneeRequest = {
  companyId: string;
  equipment_id: string;
  payload: IEquipment_Assignee;
};

export type CreateBulkEquipmentRequest = {
  companyId: string;
  payload: {
    equipments: FormData[];
  };
};

export type AddEquipmentNoteRequest = {
  companyId: string;
  equipmentId: string;
  payload: {
    note: string;
  };
};
export type AddEquipmentDocumentRequest = {
  companyId: string;
  equipmentId: string;
  payload: FormData;
};

export type DeleteEquipmentDocumentRequest = {
  companyId: string;
  equipmentId: string;
  documentId: string;
};

export enum EquipmentConstant {
  make = "make",
  model = "model",
  serial_number = "serial_number",
  type = "type",
  purchase_price = "purchase_price",
  purchase_date = "purchase_date",
  assignee = "assignee",
  country = "country",
  catalog_id = "catalog_id",
  state = "state",
  image_url = "image_url",
  refresh_status = "refresh_status",
}
