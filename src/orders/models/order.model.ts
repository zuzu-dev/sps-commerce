import { prop } from '@typegoose/typegoose';
import { IModelInstance, IMongoDocument } from 'mongoose-crud-service';
import {
  AcendaOrderItem, Fulfillment, IAcendaOrderItem, IFulfillment
} from '../../acenda/models/acenda-order.model';
import { BaseModel, IBaseInterface } from '../../shared/models/base.model';



export class Order extends BaseModel implements IOrder {
  @prop()
  retailer: string;
  @prop()
  vendor: string;
  @prop()
  retailer_id: string;
  @prop()
  vendor_id: string;
  @prop()
  shipping_first_name?: string;
  @prop()
  shipping_last_name?: string;
  @prop()
  shipping_phone_number?: string;
  @prop()
  shipping_street_line1?: string;
  @prop()
  shipping_street_line2?: string;
  @prop()
  shipping_city?: string;
  @prop()
  shipping_state?: string;
  @prop()
  shipping_zip?: string;
  @prop()
  shipping_country?: string;
  @prop()
  shipping_method?: number;
  @prop()
  shipping_rate?: number;
  @prop()
  tax_percent?: number;
  @prop()
  tax_shipping?: boolean;
  @prop()
  tax_included?: boolean;
  @prop()
  fulfillment_status?: string;
  @prop()
  marketplace_name?: string;
  @prop()
  marketplace_id?: string;
  @prop({ type: AcendaOrderItem })
  items?: AcendaOrderItem[];
  @prop({ type: Fulfillment })
  fulfillments?: Fulfillment[];
  @prop()
  status?: string
  @prop()
  date_created?: Date

}


export interface IOrder extends IBaseInterface, IModelInstance {
  retailer: string
  vendor: string
  retailer_id: string
  vendor_id: string
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
  tax_percent?: number;
  tax_shipping?: boolean;
  tax_included?: boolean;
  fulfillment_status?: string;
  marketplace_name?: string;
  marketplace_id?: string;
  items?: IAcendaOrderItem[];
  fulfillments?: IFulfillment[];
  status?: string
  date_created?: Date

}

export interface IOrderModel extends IOrder, IMongoDocument { }