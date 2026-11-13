export interface IInStorageOrderEquipment {
  id: string;
  title: string;
  serial_number: string | null;
  type: string;
  make: string;
  model: string;
  status: string;
}

export interface IInStorageOrderCountry {
  id: string;
  name: string;
  code: string;
}

export interface IInStorageOrderEntity {
  id: string;
  name: string;
}

export interface IInStorageOrderSubOrder {
  id: string;
  type: string;
  status: string;
  tracking_no: string;
  equipment?: IInStorageOrderEquipment;
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface IInStorageOrder {
  id: string;
  order_number: string;
  type: string;
  flow: string | null;
  flow_label: string | null;
  direction: string | null;
  direction_label: string | null;
  status: string;
  quantity: number;
  total_amount: number;
  currency: string;
  country: IInStorageOrderCountry;
  entity: IInStorageOrderEntity;
  ordered_by: string;
  order_date: string;
  sub_orders: IInStorageOrderSubOrder[];
  equipment: IInStorageOrderEquipment[];
  custody_links: unknown[];
}

export interface IInStorageOrdersFilterOption {
  value: string;
  label: string;
  direction?: string;
}

export interface IInStorageOrdersListData {
  data: IInStorageOrder[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  filters?: {
    directions: IInStorageOrdersFilterOption[];
    flows: IInStorageOrdersFilterOption[];
  };
}

export interface IInStorageOrdersParams {
  search?: string;
  page?: number;
  per_page?: number;
  direction?: string;
  flow?: string;
  status?: string;
  country_id?: string;
  entity_id?: string;
  from?: string;
  to?: string;
}
