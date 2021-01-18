
export class AcendaVariant implements IAcendaVariant {
  id?: number
  storeId?: string
  product_id: number;
  status: string;
  name?: string;
  sku?: string;
  barcode?: string;
  price: number;
  cost?: number;
  compare_price?: number;
  save_price?: number;
  save_percent?: number;
  position?: number;
  images?: string[];
  inventory_quantity?: number;
  inventory_minimum_quantity?: number;
  inventory_tracking?: boolean;
  inventory_policy?: string;
  inventory_shipping_estimate?: string;
  inventory_shipping_leadtime_min?: number;
  inventory_shipping_leadtime_max?: number;
  inventory_returnable?: boolean;
  has_stock?: boolean;
  popularity?: number;
  require_shipping?: boolean;
  discountable?: boolean;
  taxable?: boolean;
  weight?: string;
  date_modified?: string;
  date_created?: Date;
  enable_instockemail?: boolean;
  title?: string;
  brand?: string;
  thumbnail?: string;
  url?: string;
  taxjarcode?: string;
  data_manager_id?: string
  data_manager_source?: string
  vendor?: string
}

export interface IAcendaVariant {
  id?: number
  storeId?: string
  product_id: number
  status: string
  name?: string
  sku?: string
  barcode?: string
  price: number
  cost?: number
  compare_price?: number
  save_price?: number
  save_percent?: number
  position?: number
  images?: string[]
  inventory_quantity?: number
  inventory_minimum_quantity?: number
  inventory_tracking?: boolean
  inventory_policy?: string
  inventory_shipping_estimate?: string
  inventory_shipping_leadtime_min?: number
  inventory_shipping_leadtime_max?: number
  inventory_returnable?: boolean
  has_stock?: boolean
  popularity?: number
  require_shipping?: boolean
  discountable?: boolean
  taxable?: boolean
  weight?: string
  date_modified?: string
  date_created?: Date
  enable_instockemail?: boolean,
  title?: string
  brand?: string
  thumbnail?: string
  url?: string
  taxjarcode?: string
  data_manager_id?: string
  data_manager_source?: string
}

//export interface IAcendaVariantModel extends IAcendaVariant, IMongoDocument { }