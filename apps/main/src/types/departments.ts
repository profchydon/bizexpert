import { IEmployees } from "./employees";

interface ICreateDepartment {
  name: string;
  head_id?: string;
  members?: string[];
}

export interface IDepartment {
  id: string;
  company: {
    id: string;
    name: string;
  };
  name: string;
  member_count: number;
  asset_count: number;
  created_at: number;
  updated_at: number;
  head: null;
  members: IEmployees[];
}

export type CreateDepartmentRequest = {
  companyId: string;
  payload: ICreateDepartment;
};

export interface ILevel {
  id: string;
  company: {
    id: string;
    name: string;
  };
  name: string;
  created_at: string;
  asset_count: number;
  updated_at: string;
  members: IEmployees[];
  member_count: number;
}
