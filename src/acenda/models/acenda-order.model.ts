import { prop } from '@typegoose/typegoose';

export class AcendaOrder implements IAcendaOrder {
  id?: number;
  date_modified?: string;
  date_created?: Date;
  is_exported?: boolean;
  order_number?: string;
  status?: string;
  email?: string;
  ip?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_phone_number?: string;
  shipping_street_line1?: string;
  shipping_street_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country?: string;
  shipping_method?: number;
  shipping_rate?: number;
  shipping_rate_original?: number;
  tax_percent?: number;
  tax_shipping?: boolean;
  tax_included?: boolean;
  returns_pending?: number;
  returns_rma_numbers?: string;
  returnable_items?: number;
  giftlist_present?: boolean;
  subtotal?: string;
  tax?: number;
  tax_original?: number;
  total?: string;
  charge_amount?: string;
  unsettled?: string;
  transaction_status?: string;
  fulfillment_status?: string;
  fraud_check?: boolean;
  fraud_results?: any;
  marketplace_name?: string;
  marketplace_id?: string;
  review_request_sent?: boolean;
  shipping_address?: string;
  name?: string;
  discount_price?: string;
  discount_shipping_price?: string;
  item_subtotal?: string;
  adjusted_subtotal?: string;
  calculate_tax?: boolean;
  cancellation_window?: string;
  fraud_score?: number;
  iscancellable?: boolean;
  items?: IAcendaOrderItem[];
  returns?: any[];
  fulfillments?: any[];
  payments?: Payment[];
  refunds?: any[];
  shipping?: Shipping[];
  data_manager_source?: string;
  data_manager_id?: string;
}

export class AcendaOrderItem implements IAcendaOrderItem {
  @prop()
  id?: number;
  @prop()
  order_id?: number;
  @prop()
  product_id?: number;
  @prop()
  variant_id?: number;
  @prop()
  status?: string;
  @prop()
  name?: string;
  @prop()
  sku?: string;
  @prop()
  barcode?: string;
  @prop()
  vendor?: string;
  @prop()
  quantity?: number;
  @prop()
  fulfilled_quantity?: number;
  @prop()
  fulfillment_status?: string;
  @prop()
  ordered_quantity?: number;
  @prop()
  backorder?: boolean;
  @prop()
  price?: number;
  @prop()
  ordered_price?: number;
  @prop()
  marketplace_name?: string;
  @prop()
  marketplace_item_id?: string;
  @prop()
  warnings?: any[];
  @prop()
  date_created?: Date;
  @prop()
  date_modified?: string;
  @prop()
  taxable?: boolean;
  @prop()
  returnable?: boolean;
  @prop()
  data_manager_source?: string;
  @prop()
  data_manager_id?: string;

}

export interface IAcendaOrderItem {
  id?: number;
  order_id?: number;
  product_id?: number;
  variant_id?: number;
  status?: string;
  name?: string;
  sku?: string;
  barcode?: string;
  vendor?: string;
  quantity?: number;
  fulfilled_quantity?: number;
  fulfillment_status?: string;
  ordered_quantity?: number;
  backorder?: boolean;
  price?: number;
  ordered_price?: number;
  marketplace_name?: string;
  marketplace_item_id?: string;
  warnings?: any[];
  date_created?: Date;
  date_modified?: string;
  taxable?: boolean;
  returnable?: boolean;
  data_manager_source?: string;
  data_manager_id?: string;
}
export interface FraudResults {
  maxmind: string;
}

export interface Address {
  first_name?: string;
  last_name?: string;
  street_line1?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
  phone_number?: string;
}

export interface Payment {
  id?: number;
  order_id?: number;
  platform?: string;
  status?: string;
  amount?: number;
  charged?: number;
  address?: Address;
  date_created?: Date;
  date_modified?: string;
  refund_reason?: string;
}

export interface Shipping {
  id?: number;
  date_modified?: string;
  date_created?: Date;
  name?: string;
  status?: string;
  rule_by?: string;
  carrier_name?: string;
  carrier_method?: string;
  delivery_estimates?: string;
  position?: number;
  zone_id?: string;
}

export interface IAcendaOrder {
  id?: number;
  date_modified?: string;
  date_created?: Date;
  is_exported?: boolean;
  order_number?: string;
  status?: string;
  email?: string;
  ip?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_phone_number?: string;
  shipping_street_line1?: string;
  shipping_street_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country?: string;
  shipping_method?: number;
  shipping_rate?: number;
  shipping_rate_original?: number;
  tax_percent?: number;
  tax_shipping?: boolean;
  tax_included?: boolean;
  returns_pending?: number;
  returns_rma_numbers?: string;
  returnable_items?: number;
  giftlist_present?: boolean;
  subtotal?: string;
  tax?: number;
  tax_original?: number;
  total?: string;
  charge_amount?: string;
  unsettled?: string;
  transaction_status?: string;
  fulfillment_status?: string;
  fraud_check?: boolean;
  fraud_results?: FraudResults;
  marketplace_name?: string;
  marketplace_id?: string;
  review_request_sent?: boolean;
  shipping_address?: string;
  name?: string;
  discount_price?: string;
  discount_shipping_price?: string;
  item_subtotal?: string;
  adjusted_subtotal?: string;
  calculate_tax?: boolean;
  cancellation_window?: string;
  fraud_score?: number;
  iscancellable?: boolean;
  items?: IAcendaOrderItem[];
  returns?: any[];
  fulfillments?: IFulfillment[];
  payments?: Payment[];
  refunds?: any[];
  shipping?: Shipping[];
  data_manager_source?: string
  data_manager_id?: string
}

export interface IFulfillment {
  id?: number;
  date_modified?: string;
  date_created?: Date;
  order_id?: string;
  status?: string;
  tracking_company?: string;
  tracking_urls?: any[];
  tracking_numbers?: string[];
  shipping_method?: string;
  items?: FulfillmentItem[];
  packages?: FulfilmentPackage[];
  retailer_id?: string
}
export interface IFulfillmentItem {
  id?: number;
  product_id?: number;
  variant_id?: number;
  name?: string;
  quantity?: number;
}

export class FulfillmentItem implements IFulfillmentItem {
  @prop()
  id?: number;
  @prop()
  product_id?: number;
  @prop()
  variant_id?: number;
  @prop()
  name?: string;
  @prop()
  quantity?: number;

}


export interface IFulfilmentPackage {
  height?: number,
  weight?: number,
  depth?: number,
  width?: number
}

export class FulfilmentPackage implements IFulfilmentPackage {
  @prop()
  height?: number;
  @prop()
  weight?: number;
  @prop()
  depth?: number;
  @prop()
  width?: number;

}

export class Fulfillment implements IFulfillment {
  @prop()
  id?: number;
  @prop()
  date_modified?: string;
  @prop()
  date_created?: Date;
  @prop()
  order_id?: string;
  @prop()
  status?: string;
  @prop()
  tracking_company?: string;
  @prop()
  tracking_urls?: any[];
  @prop()
  tracking_numbers?: string[];
  @prop()
  shipping_method?: string;
  @prop({ type: FulfillmentItem })
  items?: FulfillmentItem[];
  @prop({ type: FulfilmentPackage })
  packages?: FulfilmentPackage[];
  @prop()
  retailer_id?: string
}