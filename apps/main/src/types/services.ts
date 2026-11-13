import { ICountry } from "./auth";

export interface IService {
  id: string;
  name: string;
  description: string;
  status?: "active" | "inactive";
  slug: string;
  icon?: string;
  link?: string;
  created_at: string;
  updated_at: string;
  countries?: ICountry;
}
