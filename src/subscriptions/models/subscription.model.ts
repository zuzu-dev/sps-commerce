import { IModelInstance, IMongoDocument } from 'mongoose-crud-service';

import { prop } from '@typegoose/typegoose';

import { BaseModel } from '../../shared/models/base.model';

export class Subscription extends BaseModel implements ISubscription {

  @prop()
  isActive?: boolean;
  @prop()
  storeId?: string;
  @prop()
  apiKey: string;
  @prop()
  notificationsEmail?: string;

}

export interface ISubscriptionModel extends ISubscription, IMongoDocument {
}

export interface ISubscription extends IModelInstance {
  storeId?: string;
  isActive?: boolean;
  apiKey: string;
  notificationsEmail?: string;

}

