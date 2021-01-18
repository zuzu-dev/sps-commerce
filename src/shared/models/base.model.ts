import { prop } from '@typegoose/typegoose';

export class BaseModel implements IBaseInterface {
  _id: any;
  @prop()
  storeId?: string;
  @prop()
  createdAt?: Date;
  @prop({ type: String })
  createdBy?: object;
  @prop()
  updatedAt?: Date;
  @prop({ type: String })
  updatedBy?: object;
  @prop()
  deleted?: boolean;
  @prop()
  deletedAt?: Date;
  @prop({ type: String })
  deletedBy?: object;
  @prop()
  ipAddress?: string
}

export interface IBaseInterface {
  storeId?: string
}