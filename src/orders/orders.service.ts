import { Model } from 'mongoose';
import { GenericMongooseCrudService } from 'mongoose-crud-service';
import { InjectModel } from 'nestjs-typegoose';

import { Injectable } from '@nestjs/common';

import { IOrder, IOrderModel, Order } from './models/order.model';

@Injectable()
export class OrdersService extends GenericMongooseCrudService<IOrder, IOrderModel> {
  constructor(@InjectModel(Order) orderModel: Model<IOrderModel>) { super(orderModel) }
}
