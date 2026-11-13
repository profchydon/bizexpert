import { IAsset } from "./assets";
import { IUser } from "./auth";
import { ICart } from "./cart";
import { IEquipment, IEquipmentsInStorageByCountry } from "./equipments";
import { IRoles } from "./roles";
import { IOrder as IEmployeeOrder } from "./orders";
import { IDepartment, ILevel } from "./departments";
import { ICatalog } from "./catalog";
import type { IKitItem } from "./kit";

export interface IEmployees {
  id?: any;
  first_name: string;
  last_name: string;
  email: string;
  personal_email: string | null;
  password?: string;
  address: string;
  company_currency_id?: string;
  country_id: string;
  phone: string;
  job_title: string;
  line_manager?: Partial<IEmployees> | null;
  manager?: Partial<IEmployees> | null;
  manager_id?: string | null;
  sso_id: string | null;
  employment_type: string;
  tax_number: string | null;
  level: string;
  level_position?: ILevel;
  department_id: string;
  departments: IDepartment[];
  department?: IDepartment;
  last_login?: string;
  status: string;
  items?: ICart[];
  storageItems?: IEquipmentsInStorageByCountry[];
  country?: string;
  country_code?: string;
  office_id?: string | null;
  office?: { id: string; name: string } | null;
  destination_type?: "employee" | "office" | "storage";
  contact_employee_id?: string | null;
  can_edit_address?: boolean;
  landmark: null | string;
  stage: string;
  email_verified_at: null;
  remember_token: null;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  laravel_through_key: string;
  roles: IRoles[];
  user_company: IUserCompany;
  equipment?: IEquipment[];
  orders?: IEmployeeOrder[];
  fulfilment_date?: string;
  note?: string;
  currency_code: string;
  catalogs?: ICatalog[];
  catalog_policies?: IEmployeeCatalogPolicy[];
  requestId?: string;
}

export interface IEmployeeCatalogPolicy {
  id: string;
  name: string;
  description?: string | null;
  status?: string;
  purpose?: string;
  is_archived?: boolean;
  matched_rule_id?: string | null;
  selection_mode?: "fixed" | "open" | "prohibit";
  approval_type?: "auto" | "manual";
  budget_per_employee?: number | string | null;
  selection_config?: unknown;
  kits?: {
    data?: {
      id: string;
      name?: string | null;
      status?: string | null;
      is_archived?: boolean;
      fulfillment_mode?: string | null;
      items_count?: number | null;
      updated_at?: string;
      items?: {
        data?: IKitItem[];
        total?: number;
        per_page?: number;
        current_page?: number;
        last_page?: number;
      };
    }[];
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
}

export type EmployeeCatalogPolicyOrderRequestPayload = {
  department_id: string;
  order_note: string;
  items: {
    kit_item_id: string;
    quantity: number;
  }[];
};

export interface IUserCompany {
  id: string;
  user_id: string;
  company_id: string;
  role_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  office?: { id: string; name: string } | null;
}

export interface IUserInvitation {
  id: string;
  email: string;
  role_id: string;
  company_id: string;
  code: string;
  user: IUser | null;
  invited_by: IUser | null;
  employment_type: string;
  level: string;
  department_id: string;
  status: string;
}

export interface IOrder {
  asset_pricing_id: string;
  employee_id: string;
  quantity: number;
  note: string;
  fulfillment_date: string;
  device_setup: string[];
  catalog_request_id?: string;
}

export type AddEmployeeRequest = {
  companyId: string;
  payload: IEmployees;
};

interface IInviteEmployees {
  emails: string[];
  role: string;
  level_id?: string;
  department_id?: string;
}

export type IInviteEmployeesRequest = {
  companyId: string;
  payload: IInviteEmployees;
};

export type IAcceptInvitationRequest = {
  code: string;
  payload: Partial<IEmployees>;
};

export type EditEmployeeRequest = {
  companyId: string;
  employeeId: string;
  payload: IEmployees;
};

export type AddBulkEmployeeRequest = {
  companyId: string;
  payload: {
    employees: IEmployees[];
  };
};

export type DeleteEmployeeRequest = {
  companyId: string;
  employeeId: string;
};

export interface IEmployeeOrderDetail {
  order_id: string;
  order_number: string;
  pick_up_status: null | string;
  delivery_status: null | string;
  budget_count: null | number;
  order_date: string;
  status: string;
  items: IAsset[];
}

export interface IEmployeeRequest {
  id: string;
  department: IDepartment;
  employee: IEmployees;
  catalog: ICatalog;
  order?: null | IEmployeeOrder;
  status: string;
  total_amount: string;
  currency: string;
  items: ICart[];
  items_count: number;
  created_at: string;
  rejection_reason: string;
}

export type GetEmployeesResponse = ServerResponse<IEmployees>;
