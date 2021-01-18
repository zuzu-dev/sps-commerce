import { IModelInstance, IMongoDocument } from 'mongoose-crud-service';

import { prop } from '@typegoose/typegoose';

import { BaseModel, IBaseInterface } from '../../shared/models/base.model';
import { ISubscription, Subscription } from '../../subscriptions/models/subscription.model';

export class AcendaAdapter extends BaseModel implements IAcendaAdapter {
  @prop({ type: Subscription })
  stores: ISubscription[];
}

export interface IAcendaAdapter extends IModelInstance, IBaseInterface {
  stores: ISubscription[]
}

export interface IAcendaAdapterModel extends IMongoDocument, IAcendaAdapter { }

